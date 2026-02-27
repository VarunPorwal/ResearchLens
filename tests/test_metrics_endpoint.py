from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch, MagicMock

client = TestClient(app)

@patch('app.services.rag.RAGService.extract_metrics')
@patch('os.path.exists')
def test_metrics_endpoint(mock_exists, mock_extract):
    mock_exists.return_value = True
    # Return valid JSON string
    mock_extract.return_value = """
    {
      "metrics": [
        {
          "label": "Sample Size",
          "value": 100,
          "unit": "people",
          "category": "numerical"
        }
      ]
    }
    """
    
    payload = {
        "file_id": "test-id",
        "api_key": "dummy"
    }
    
    response = client.post("/api/metrics", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["metrics"]) == 1
    assert data["metrics"][0]["label"] == "Sample Size"
    assert data["paper_id"] == "test-id"

def test_metrics_invalid_json():
     with patch('app.services.rag.RAGService.extract_metrics', return_value="Bad JSON"):
        with patch('os.path.exists', return_value=True):
            response = client.post("/api/metrics", json={"file_id": "id", "api_key": "k"})
            assert response.status_code == 500
