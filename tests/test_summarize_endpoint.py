from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch

client = TestClient(app)

@patch('app.services.rag.RAGService.summarize_document')
@patch('os.path.exists')
def test_summarize_endpoint(mock_exists, mock_summarize):
    mock_exists.return_value = True
    # Return a valid JSON string structure matching StructuredSummary
    mock_summarize.return_value = """
    {
      "title": "Test Paper",
      "objective": "To test",
      "methodology": {
        "approach": "Unit testing",
        "tools": ["pytest"]
      },
      "key_findings": [
        {"finding": "It works", "evidence": "Green stick"}
      ],
      "conclusion": "Good",
      "limitations": ["None"]
    }
    """
    
    payload = {
        "file_id": "test-id",
        "api_key": "dummy"
    }
    
    response = client.post("/api/summarize", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Paper"
    assert data["methodology"]["approach"] == "Unit testing"

def test_summarize_invalid_json():
    with patch('app.services.rag.RAGService.summarize_document', return_value="Not JSON"):
        with patch('os.path.exists', return_value=True):
            response = client.post("/api/summarize", json={"file_id": "id", "api_key": "k"})
            assert response.status_code == 500
            assert "LLM failed" in response.json()["detail"]
