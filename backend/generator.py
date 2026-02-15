import os
import json
from jinja2 import Environment, FileSystemLoader
from sqlalchemy.orm import Session
from . import models
import xml.etree.ElementTree as ET
from datetime import datetime

OUTPUT_DIR = os.getenv("OUTPUT_DIR", "output")
TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "templates")

def run_build(db: Session):
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
    base_template = env.get_template("base.html")

    pages = db.query(models.Content).filter(models.Content.is_published == True).all()
    
    # improved: Fetch the first menu for navigation (or default empty)
    menu_record = db.query(models.Menu).first()
    menu_items = []
    logo_url = None
    if menu_record:
        if menu_record.items:
            try:
                menu_items = json.loads(menu_record.items)
            except:
                pass
        logo_url = menu_record.logo_url

    # Generate pages
    for page in pages:
        # Render blocks
        blocks_html = ""
        page_blocks = []
        if page.blocks:
            try:
                page_blocks = json.loads(page.blocks)
            except:
                pass
        
        for index, block in enumerate(page_blocks):
            try:
                block_template = env.get_template(f"blocks/{block['type']}.html")
                # Inject unique block_id
                block_id = f"block-{index}"
                blocks_html += block_template.render(data=block['data'], block_id=block_id)
            except Exception as e:
                print(f"Error rendering block {block.get('type')}: {e}")

        # Fallback to body if no blocks (migration support)
        if not blocks_html and page.body:
             # Wrap legacy body in a container
             blocks_html = f'<div class="container mx-auto px-4 py-8 prose">{page.body}</div>'

        html_content = base_template.render(
            title=page.title,
            meta_description=page.meta_description,
            body_html=blocks_html,
            menu_items=menu_items,
            logo_url=logo_url,
            cta_text=menu_record.cta_text if menu_record else None,
            cta_link=menu_record.cta_link if menu_record else None,
            cta_color=menu_record.cta_color if menu_record else "#3b82f6",
            cta_hover_color=menu_record.cta_hover_color if menu_record else "#2563eb",
            created_at=page.created_at
        )
        
        file_name = f"{page.slug}.html"
        with open(os.path.join(OUTPUT_DIR, file_name), "w", encoding="utf-8") as f:
            f.write(html_content)

    # Generate Sitemap
    root = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    for page in pages:
        url = ET.SubElement(root, "url")
        loc = ET.SubElement(url, "loc")
        loc.text = f"/{page.slug}.html"
        lastmod = ET.SubElement(url, "lastmod")
        lastmod.text = datetime.now().strftime("%Y-%m-%d")

    tree = ET.ElementTree(root)
    tree.write(os.path.join(OUTPUT_DIR, "sitemap.xml"), encoding="utf-8", xml_declaration=True)
