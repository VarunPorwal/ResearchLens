from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch, mock_open
import json

client = TestClient(app)

@patch('os.listdir')
@patch('os.path.exists')
@patch('builtins.open', new_callable=mock_open)
def test_list_papers(mock_file, mock_exists, mock_listdir):
    mock_exists.return_value = True
    mock_listdir.return_value = ["test_id.json"]
    
    # Mock file content
    mock_data = {
        "0": {"source": "test.pdf", "file_id": "test_id"}
    }
    mock_file.return_value.read.return_value = json.dumps(mock_data)
    
    response = client.get("/api/papers")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["papers"]) == 1
    assert data["papers"][0]["filename"] == "test.pdf"
    assert data["papers"][0]["file_id"] == "test_id"
    assert data["papers"][0]["chunks_count"] == 1
