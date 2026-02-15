import sqlite3
import os

db_path = "cms.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("--- MENUS ---")
    cursor.execute("SELECT id, title FROM menus")
    for row in cursor.fetchall():
        print(row)
        
    print("\n--- SETTINGS ---")
    cursor.execute("SELECT * FROM settings")
    for row in cursor.fetchall():
        print(row)
    
    conn.close()
else:
    print("Database not found")
