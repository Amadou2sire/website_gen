import requests
import os
import sys

BASE_URL = "http://localhost:8000/api"

def test_create_page():
    print("Testing Create Page...")
    payload = {
        "title": "Verification Page",
        "body": "<h1>Verification</h1><p>This is a verification page.</p>",
        "meta_description": "Verify SSG",
        "is_published": True
    }
    try:
        response = requests.post(f"{BASE_URL}/pages", json=payload)
        response.raise_for_status()
        print("Page created successfully:", response.json())
        return response.json()
    except requests.exceptions.HTTPError as e:
        print(f"Failed to create page: {e}")
        print("Response content:", response.text)
        # If it's a unique constraint error, we can consider it a "success" in terms of server reachability
        if "UNIQUE constraint failed" in response.text:
            print("Note: Page already exists. Continuing verification.")
            return {"id": 1} # Mock ID
        sys.exit(1)
    except Exception as e:
        print(f"Failed to create page: {e}")
        sys.exit(1)

def test_build_site():
    print("Testing Build Site...")
    try:
        response = requests.post(f"{BASE_URL}/build")
        response.raise_for_status()
        print("Site built successfully:", response.json())
    except Exception as e:
        print(f"Failed to build site: {e}")
        sys.exit(1)

def verify_output():
    print("Verifying Output Files...")
    output_dir = os.path.join(os.path.dirname(__file__), "output") # Assuming script is in root
    file_path = os.path.join(output_dir, "verification-page.html")
    
    if os.path.exists(file_path):
        print(f"File {file_path} exists.")
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            if "<h1>Verification</h1>" in content:
                print("Content verified.")
            else:
                print("Content mismatch.")
                sys.exit(1)
    else:
        print(f"File {file_path} NOT found.")
        sys.exit(1)

if __name__ == "__main__":
    test_create_page()
    test_build_site()
    verify_output()
