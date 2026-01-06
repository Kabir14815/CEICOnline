import requests
import sys

BASE_URL = "http://localhost:8000"

def verify_api():
    print("Verifying API...")
    
    # 1. Login
    print("1. Logging in...")
    login_data = {"email": "admin@example.com", "password": "adminpassword"}
    response = requests.post(f"{BASE_URL}/admin/login", json=login_data)
    if response.status_code != 200:
        print(f"Login failed: {response.text}")
        return False
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful.")

    # 2. Create News
    print("2. Creating news...")
    news_data = {
        "title": "API Verification News",
        "slug": "api-verification-news",
        "content": "<p>Content</p>",
        "category": "Exams",
        "status": "published",
        "language": "en"
    }
    response = requests.post(f"{BASE_URL}/news/", json=news_data, headers=headers)
    if response.status_code != 200:
        print(f"Create news failed: {response.text}")
        return False
    news_id = response.json()["_id"]
    print(f"News created with ID: {news_id}")

    # 3. Fetch Public News
    print("3. Fetching public news...")
    response = requests.get(f"{BASE_URL}/news")
    if response.status_code != 200:
        print(f"Fetch news failed: {response.text}")
        return False
    news_list = response.json()
    found = any(n["_id"] == news_id for n in news_list)
    if not found:
        print("Created news not found in public list")
        return False
    print("News found in public list.")

    # 4. Delete News
    print("4. Deleting news...")
    response = requests.delete(f"{BASE_URL}/news/{news_id}", headers=headers)
    if response.status_code != 200:
        print(f"Delete news failed: {response.text}")
        return False
    print("News deleted successfully.")

    print("API Verification Passed!")
    return True

if __name__ == "__main__":
    try:
        if verify_api():
            sys.exit(0)
        else:
            sys.exit(1)
    except Exception as e:
        print(f"Verification failed with error: {e}")
        sys.exit(1)
