from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    expected_keys = {"status", "system", "message"}
    assert expected_keys.issubset(response.json().keys())
    assert response.json()["status"] == "online"
