import pytest
from app.services.embedding import EmbeddingService

def test_embed_texts():
    # This might download the model on first run
    texts = ["Hello world", "This is a test"]
    embeddings = EmbeddingService.embed_texts(texts)
    
    assert len(embeddings) == 2
    assert len(embeddings[0]) == 384 # BGE-small dimension
    assert isinstance(embeddings[0][0], float)
