from pydantic import BaseModel, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime

class Block(BaseModel):
    id: str
    type: str # 'hero', 'text', 'features', 'cta'
    data: Dict[str, Any]

class MenuItem(BaseModel):
    label: str
    url: str
    children: Optional[List['MenuItem']] = []

class MenuBase(BaseModel):
    title: str
    logo_url: Optional[str] = None
    items: List[MenuItem]
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    cta_color: Optional[str] = "#3b82f6"
    cta_hover_color: Optional[str] = "#2563eb"

class MenuCreate(MenuBase):
    pass

class MenuUpdate(MenuBase):
    pass

class MenuResponse(MenuBase):
    id: int

    class Config:
        from_attributes = True

    @field_validator('items', mode='before')
    @classmethod
    def parse_items(cls, v):
        if isinstance(v, str):
            import json
            return json.loads(v)
        return v

class PageBase(BaseModel):
    title: str
    body: Optional[str] = ""
    blocks: List[Block] = []
    meta_description: Optional[str] = ""
    is_published: bool = False

class PageCreate(PageBase):
    pass

class PageUpdate(PageBase):
    pass

class PageResponse(PageBase):
    id: int
    slug: str
    created_at: datetime

    class Config:
        from_attributes = True

    @field_validator('blocks', mode='before')
    @classmethod
    def parse_blocks(cls, v):
        if isinstance(v, str):
            import json
            return json.loads(v)
        return v
