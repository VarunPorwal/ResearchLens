from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch, MagicMock

client = TestClient(app)

@patch('app.services.rag.RAGService.compare_documents')
def test_compare_endpoint(mock_compare):
    mock_compare.return_value = "Paper A is better than Paper B."
    
    payload = {
        "file_ids": ["id1", "id2"],
        "query": "Which is better?",
        "api_key": "dummy"
    }
    
    response = client.post("/api/compare", json=payload)
    
    assert response.status_code == 200
    assert response.json()["comparison"] == "Paper A is better than Paper B."

def test_compare_endpoint_insufficient_papers():
    payload = {
        "file_ids": ["id1"], # Only 1 paper
        "api_key": "dummy"
    }
    response = client.post("/api/compare", json=payload)
    assert response.status_code == 400
