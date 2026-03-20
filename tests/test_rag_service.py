import pytest
from app.services.rag import RAGService
from unittest.mock import patch, MagicMock

@patch('app.services.embedding.EmbeddingService.embed_texts')
@patch('app.services.vector_store.VectorStoreService.load_index')
@patch('app.services.vector_store.VectorStoreService.load_metadata')
@patch('app.services.vector_store.VectorStoreService.search')
def test_retrieve(mock_search, mock_meta, mock_index, mock_embed):
    # Setup
    mock_embed.return_value = [[0.1]*384]
    mock_search.return_value = ([0.5, 0.6], [0, 1])
    mock_meta.return_value = {
        "0": {"text": "Chunk 1"},
        "1": {"text": "Chunk 2"}
    }
    
    results = RAGService.retrieve("query", "file_id", "user_id")
    
    assert len(results) == 2
    assert results[0] == "Chunk 1"
    assert results[1] == "Chunk 2"

@patch('google.generativeai.GenerativeModel')
def test_generate_answer(mock_model_cls):
    mock_model = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "Generated Answer"
    mock_model.generate_content.return_value = mock_response
    mock_model_cls.return_value = mock_model
    
    answer = RAGService.generate_answer("query", ["context"])
    assert answer == "Generated Answer"
