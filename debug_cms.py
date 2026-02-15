from fastapi.testclient import TestClient
from backend.main import app
import sys
import traceback

client = TestClient(app)

print("Testing Create Page...")
payload = {
    "title": "Debug Page",
    "body": "<h1>Debug</h1>",
    "meta_description": "Debug",
    "is_published": True
}
try:
    response = client.post("/api/pages", json=payload)
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        print(response.text)
    else:
        print("Success")
except Exception as e:
    print("Exception occurred:")
    print(e)
    traceback.print_exc()
