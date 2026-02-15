import requests
import sys

BASE_URL = "http://localhost:8000/api"

def test_create_page():
    print("Testing Create Page...")
    payload = {
        "title": "Test Page",
        "body": "<h1>Test Content</h1>",
        "meta_description": "Testing the API",
        "is_published": True
    }
    response = requests.post(f"{BASE_URL}/pages", json=payload)
    if response.status_code == 200:
        data = response.json()
        print(f"Success: Created page with ID {data['id']}")
        return data['id']
    else:
        print(f"Failed: {response.status_code} - {response.text}")
        sys.exit(1)

def test_list_pages():
    print("Testing List Pages...")
    response = requests.get(f"{BASE_URL}/pages")
    if response.status_code == 200:
        pages = response.json()
        print(f"Success: Retrieved {len(pages)} pages")
    else:
        print(f"Failed: {response.status_code} - {response.text}")
        sys.exit(1)

def test_build_site():
    print("Testing Build Site...")
    response = requests.post(f"{BASE_URL}/build")
    if response.status_code == 200:
        print("Success: Site build triggered")
    else:
        print(f"Failed: {response.status_code} - {response.text}")
        sys.exit(1)

if __name__ == "__main__":
    try:
        page_id = test_create_page()
        test_list_pages()
        test_build_site()
        print("\nAll API tests passed!")
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API. Is the backend server running?")
        sys.exit(1)
