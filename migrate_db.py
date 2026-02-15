import sqlite3
import os

db_path = "cms.db"
if os.path.exists(db_path):
    from backend.database import engine
    from backend import models
    print("Ensuring all tables exist...")
    models.Base.metadata.create_all(bind=engine)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check columns of menus table
    cursor.execute("PRAGMA table_info(menus)")
    columns = [row[1] for row in cursor.fetchall()]
    
    if "logo_url" not in columns:
        print("Adding logo_url column to menus table...")
        cursor.execute("ALTER TABLE menus ADD COLUMN logo_url VARCHAR(255)")
        conn.commit()

    if "cta_text" not in columns:
        print("Adding cta_text column to menus table...")
        cursor.execute("ALTER TABLE menus ADD COLUMN cta_text VARCHAR(50)")
        conn.commit()

    if "cta_link" not in columns:
        print("Adding cta_link column to menus table...")
        cursor.execute("ALTER TABLE menus ADD COLUMN cta_link VARCHAR(255)")
        conn.commit()

    if "cta_color" not in columns:
        print("Adding cta_color column to menus table...")
        cursor.execute("ALTER TABLE menus ADD COLUMN cta_color VARCHAR(20) DEFAULT '#3b82f6'")
        conn.commit()

    if "cta_hover_color" not in columns:
        print("Adding cta_hover_color column to menus table...")
        cursor.execute("ALTER TABLE menus ADD COLUMN cta_hover_color VARCHAR(20) DEFAULT '#2563eb'")
        conn.commit()
    
    # Check columns of content table
    cursor.execute("PRAGMA table_info(content)")
    columns = [row[1] for row in cursor.fetchall()]
    
    if "blocks" not in columns:
        print("Adding blocks column to content table...")
        cursor.execute("ALTER TABLE content ADD COLUMN blocks TEXT DEFAULT '[]'")
        conn.commit()
    
    if "is_homepage" not in columns:
        print("Adding is_homepage column to content table...")
        cursor.execute("ALTER TABLE content ADD COLUMN is_homepage BOOLEAN DEFAULT 0")
        conn.commit()
    
    print("Migration check complete.")
    conn.close()
else:
    print("Database not found.")
