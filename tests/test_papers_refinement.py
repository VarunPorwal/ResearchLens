from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch, mock_open
import json

client = TestClient(app)

@patch('os.path.exists')
@patch('os.remove')
@patch('builtins.open', new_callable=mock_open)
def test_get_paper_details(mock_file, mock_remove, mock_exists):
    mock_exists.return_value = True
    mock_data = {"0": {"source": "test.pdf"}}
    mock_file.return_value.read.return_value = json.dumps(mock_data)
    
    response = client.get("/api/papers/test-id")
    assert response.status_code == 200
    assert response.json()["file_id"] == "test-id"

@patch('os.path.exists')
@patch('os.remove')
def test_delete_paper(mock_remove, mock_exists):
    mock_exists.return_value = True # File exists
    
    response = client.delete("/api/papers/test-id")
    
    assert response.status_code == 200
    assert "deleted" in response.json()["message"]
    assert mock_remove.call_count == 2 # Index + Metadata
