from sentence_transformers import SentenceTransformer
from typing import List
import os

class EmbeddingService:
    _model = None
    
    @classmethod
    def get_model(cls):
        if cls._model is None:
            # efficient, small model
            cls._model = SentenceTransformer('BAAI/bge-small-en-v1.5')
        return cls._model

    @classmethod
    def embed_texts(cls, texts: List[str]) -> List[List[float]]:
        """
        Generates embeddings for a list of texts.
        """
        model = cls.get_model()
        # normalize_embeddings=True for cosine similarity
        embeddings = model.encode(texts, normalize_embeddings=True)
        return embeddings.tolist()
