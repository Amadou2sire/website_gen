import os
import sqlite3
from backend.database import engine, Base
from backend import models

def reset_database():
    db_path = "cms.db"
    
    # Close any existing connections if possible (though uvicorn might keep it open)
    # Since we are on Windows, we might have file lock issues if uvicorn is running.
    
    print("Attempting to reset database...")
    
    try:
        # Instead of deleting the file which might be locked, let's try dropping all tables
        # using a fresh connection or SQLAlchemy
        
        print("Dropping all tables...")
        Base.metadata.drop_all(bind=engine)
        
        print("Recreating all tables...")
        Base.metadata.create_all(bind=engine)
        
        print("Database has been reset successfully.")
    except Exception as e:
        print(f"Error resetting database: {e}")
        print("Trying alternative: direct SQLite delete and recreate...")
        try:
            if os.path.exists(db_path):
                # This might fail if uvicorn is holding the file
                os.remove(db_path)
                print(f"Removed {db_path}")
            
            Base.metadata.create_all(bind=engine)
            print("Database recreated successfully.")
        except Exception as e2:
            print(f"Failed to reset database: {e2}")
            print("Tip: If the database is locked, try stopping the uvicorn server first.")

if __name__ == "__main__":
    reset_database()
