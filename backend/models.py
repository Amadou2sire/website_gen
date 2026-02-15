from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from .database import Base

class Content(Base):
    __tablename__ = "content"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(60), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    meta_description = Column(String(160))
    body = Column(Text)
    blocks = Column(Text, default="[]")
    is_published = Column(Boolean, default=False)
    is_homepage = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Menu(Base):
    __tablename__ = "menus"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), unique=True, index=True, nullable=False)
    logo_url = Column(String(255), nullable=True)
    items = Column(Text, default="[]")
    cta_text = Column(String(50), nullable=True)
    cta_link = Column(String(255), nullable=True)
    cta_color = Column(String(20), default="#3b82f6")
    cta_hover_color = Column(String(20), default="#2563eb")

class Settings(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    brand_primary = Column(String(20), default="#3b82f6")
    brand_hover = Column(String(20), default="#2563eb")
