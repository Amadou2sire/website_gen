from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import re
import os
import shutil
from . import models, database, schemas
from .database import engine, get_db
from .generator import run_build

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="StaticCMS API", debug=True)

from fastapi.staticfiles import StaticFiles

UPLOAD_DIR = "./output/uploads"
if not os.path.exists(UPLOAD_DIR):
   os.makedirs(UPLOAD_DIR)

app.mount("/output", StaticFiles(directory="./output"), name="output")



# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text).strip('-')
    return text

import json

# ... (slugify functions remain)

@app.post("/api/pages", response_model=schemas.PageResponse)
def create_page(page: schemas.PageCreate, db: Session = Depends(get_db)):
    slug = slugify(page.title)
    blocks_json = json.dumps([b.model_dump() for b in page.blocks]) 
    db_page = models.Content(
        title=page.title,
        slug=slug,
        body=page.body,
        blocks=blocks_json,
        meta_description=page.meta_description,
        is_published=page.is_published
    )
    db.add(db_page)
    db.commit()
    db.refresh(db_page)
    
    # Auto-build on save
    try:
        run_build(db)
    except Exception as e:
        print(f"Build failed during creation: {e}")
        
    return db_page

@app.get("/api/pages", response_model=List[schemas.PageResponse])
def list_pages(db: Session = Depends(get_db)):
    return db.query(models.Content).all()

@app.get("/api/pages/{page_id}", response_model=schemas.PageResponse)
def get_page(page_id: int, db: Session = Depends(get_db)):
    page = db.query(models.Content).filter(models.Content.id == page_id).first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page

@app.put("/api/pages/{page_id}", response_model=schemas.PageResponse)
def update_page(page_id: int, page: schemas.PageUpdate, db: Session = Depends(get_db)):
    db_page = db.query(models.Content).filter(models.Content.id == page_id).first()
    if not db_page:
        raise HTTPException(status_code=404, detail="Page not found")
    
    db_page.title = page.title
    db_page.slug = slugify(page.title)
    db_page.body = page.body
    db_page.blocks = json.dumps([b.model_dump() for b in page.blocks])
    db_page.meta_description = page.meta_description
    db_page.is_published = page.is_published
    
    db.commit()
    db.refresh(db_page)
    
    # Auto-build on save
    try:
        run_build(db)
    except Exception as e:
        print(f"Build failed during update: {e}")
        
    return db_page

# Menu Endpoints
@app.get("/api/menus", response_model=List[schemas.MenuResponse])
def list_menus(db: Session = Depends(get_db)):
    return db.query(models.Menu).all()

@app.post("/api/menus", response_model=schemas.MenuResponse)
def create_menu(menu: schemas.MenuCreate, db: Session = Depends(get_db)):
    items_json = json.dumps([i.model_dump() for i in menu.items])
    db_menu = models.Menu(
        title=menu.title, 
        logo_url=menu.logo_url, 
        items=items_json,
        cta_text=menu.cta_text,
        cta_link=menu.cta_link,
        cta_color=menu.cta_color
    )
    db.add(db_menu)
    db.commit()
    db.refresh(db_menu)
    return db_menu
@app.put("/api/menus/{menu_id}", response_model=schemas.MenuResponse)
def update_menu(menu_id: int, menu: schemas.MenuUpdate, db: Session = Depends(get_db)):
    db_menu = db.query(models.Menu).filter(models.Menu.id == menu_id).first()
    if not db_menu:
        raise HTTPException(status_code=404, detail="Menu not found")
    
    db_menu.title = menu.title
    db_menu.logo_url = menu.logo_url
    db_menu.items = json.dumps([i.model_dump() for i in menu.items])
    db_menu.cta_text = menu.cta_text
    db_menu.cta_link = menu.cta_link
    db_menu.cta_color = menu.cta_color
    db_menu.cta_hover_color = menu.cta_hover_color
    db.commit()
    db.refresh(db_menu)
    return db_menu

# Settings Endpoints
@app.get("/api/settings", response_model=schemas.SettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(models.Settings).first()
    if not settings:
        settings = models.Settings(brand_primary="#3b82f6", brand_hover="#2563eb")
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@app.put("/api/settings", response_model=schemas.SettingsResponse)
def update_settings(settings_data: schemas.SettingsUpdate, db: Session = Depends(get_db)):
    db_settings = db.query(models.Settings).first()
    if not db_settings:
        db_settings = models.Settings()
        db.add(db_settings)
    
    db_settings.brand_primary = settings_data.brand_primary
    db_settings.brand_hover = settings_data.brand_hover
    db.commit()
    db.refresh(db_settings)
    
    # Auto-build on save
    try:
        run_build(db)
    except Exception as e:
        print(f"Build failed during settings update: {e}")
        
    return db_settings

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return the URL to access the file
        return {"url": f"http://localhost:8000/output/uploads/{file.filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate")
def build_site(db: Session = Depends(get_db)):
    try:
        run_build(db)
        return {"status": "success", "message": "Site generated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
