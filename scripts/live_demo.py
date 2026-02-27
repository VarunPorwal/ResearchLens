import requests
import os
import sys

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

BASE_URL = "http://127.0.0.1:8000/api"

def main():
    print("=== ResearchLens Live Demo ===")
    
    # Check if server is running
    try:
        requests.get(f"{BASE_URL}/health")
    except requests.exceptions.ConnectionError:
        print("Error: The API server is not running.")
        print("Please run 'uvicorn app.main:app --reload' in a separate terminal.")
        return

    # Try to get API Key from env
    from app.core.config import settings
    api_key = settings.GEMINI_API_KEY
    
    if not api_key:
        print("API Key not found in .env")
        api_key = input("Enter your Gemini API Key: ").strip()
        if not api_key:
            print("API Key is required.")
            return
    else:
        print("Using API Key from .env")

    # Input File
    file_path = input("Enter path to a PDF file to ingest: ").strip().strip('"').strip("'")
    if not os.path.exists(file_path):
        print(f"File not found at: {file_path}")
        return

    # 1. Ingest
    print(f"\n[1] Uploading {file_path}...")
    with open(file_path, 'rb') as f:
        files = {'file': (os.path.basename(file_path), f, 'application/pdf')}
        response = requests.post(f"{BASE_URL}/ingest", files=files)
    
    if response.status_code != 200:
        print(f"Ingestion failed: {response.text}")
        return
    
    file_id = response.json().get("file_id")
    print(f" > Success! File ID: {file_id}")

    # 2. Extract Metrics
    print("\n[2] Extracting Metrics...")
    input("Press Enter to extract metrics...")
    response = requests.post(f"{BASE_URL}/metrics", json={"file_id": file_id, "api_key": api_key})
    if response.status_code == 200:
        print(response.json())
    else:
        print(f"Metrics failed: {response.text}")

    # 3. Summarize
    print("\n[3] Generating Summary...")
    input("Press Enter to summarize...")
    response = requests.post(f"{BASE_URL}/summarize", json={"file_id": file_id, "api_key": api_key})
    if response.status_code == 200:
        print(response.json())
    else:
        print(f"Summary failed: {response.text}")

    # 4. Chat
    print("\n[4] Chat Mode")
    while True:
        query = input("\nAsk a question (or 'q' to quit): ").strip()
        if query.lower() == 'q':
            break
            
        response = requests.post(f"{BASE_URL}/chat", json={
            "query": query, 
            "file_id": file_id, 
            "api_key": api_key
        })
        
        if response.status_code == 200:
            print(f" > Answer: {response.json()['answer']}")
        else:
            print(f"Chat failed: {response.text}")

    print("\nDemo Completed.")

if __name__ == "__main__":
    main()
