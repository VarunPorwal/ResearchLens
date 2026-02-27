from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch, MagicMock
import io

client = TestClient(app)

@patch('app.services.ingestion.IngestionService.extract_text')
@patch('app.services.ingestion.IngestionService.chunk_text')
@patch('app.services.embedding.EmbeddingService.embed_texts')
@patch('app.services.vector_store.VectorStoreService.create_index')
@patch('app.services.vector_store.VectorStoreService.add_vectors')
@patch('app.services.vector_store.VectorStoreService.save_index')
@patch('app.services.vector_store.VectorStoreService.save_metadata')
def test_ingest_pdf(mock_save_meta, mock_save_index, mock_add, mock_create, mock_embed, mock_chunk, mock_extract):
    # Setup mocks
    mock_extract.return_value = "Mock text content"
    mock_chunk.return_value = ["Mock chunk 1", "Mock chunk 2"]
    mock_embed.return_value = [[0.1]*384, [0.1]*384]
    mock_create.return_value = MagicMock()
    
    # Create dummy PDF file object
    pdf_content = b"%PDF-1.4..."
    files = {'file': ('test.pdf', pdf_content, 'application/pdf')}
    
    response = client.post("/api/ingest", files=files)
    
    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == "test.pdf"
    assert "index_path" in data
    assert "message" in data
    
    # Verify service calls
    mock_extract.assert_called_once()
    mock_chunk.assert_called_once()
    mock_embed.assert_called_once()
    mock_create.assert_called_once()
    mock_add.assert_called_once()
    mock_save_index.assert_called_once()
    mock_save_meta.assert_called_once()

def test_ingest_invalid_file_type():
    files = {'file': ('test.txt', b"text", 'text/plain')}
    response = client.post("/api/ingest", files=files)
    assert response.status_code == 400
