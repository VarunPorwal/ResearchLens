import pytest
from app.main import app
from app.core.auth import get_current_user

class MockUser:
    def __init__(self):
        self.id = "test_user_id"

def override_get_current_user():
    return MockUser()

@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = override_get_current_user
    yield
    app.dependency_overrides = {}

from unittest.mock import MagicMock

@pytest.fixture(autouse=True)
def mock_supabase(monkeypatch):
    mock_sb = MagicMock()
    mock_sb.storage.from_.return_value.upload.return_value = None
    mock_sb.table.return_value.insert.return_value.execute.return_value = {"data": [{"id": "test"}]}
    mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value = {"data": [{"id": "test", "title": "Test Paper", "created_at": "2023-01-01"}]}
    mock_sb.table.return_value.delete.return_value.eq.return_value.execute.return_value = {"data": []}
    
    monkeypatch.setattr('app.api.endpoints.ingest.supabase', mock_sb)
    monkeypatch.setattr('app.api.endpoints.papers.supabase', mock_sb)
    # Just in case other endpoints use it directly
    try:
        monkeypatch.setattr('app.core.supabase_client.supabase', mock_sb)
    except AttributeError:
        pass
