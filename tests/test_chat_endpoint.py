from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch, MagicMock

client = TestClient(app)

@patch('app.services.rag.RAGService.answer_question')
@patch('os.path.exists')
def test_chat_endpoint(mock_exists, mock_answer):
    # Setup mocks
    mock_exists.return_value = True # Simulate index exists
    mock_answer.return_value = {
        "query": "What is x?",
        "answer": "X is Y.",
        "context": ["Context 1"]
    }
    
    payload = {
        "query": "What is x?",
        "file_id": "test-file-id",
        "api_key": "dummy-key"
    }
    
    response = client.post("/api/chat", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["answer"] == "X is Y."
    assert len(data["context"]) == 1

def test_chat_endpoint_missing_file():
    payload = {
        "query": "What is x?",
        "file_id": "missing-file-id",
        "api_key": "dummy-key"
    }
    # Don't mock os.path.exists here (or mock it to False if needed, but default is real fs which won't have it)
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 404
