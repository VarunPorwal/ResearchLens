import os
import google.generativeai as genai
from typing import List
from app.core.config import settings

class EmbeddingService:
    @classmethod
    def get_model(cls):
        # We don't need a local model anymore, just ensure Gemini is configured
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set in environment or config.")
        genai.configure(api_key=settings.GEMINI_API_KEY)

    @classmethod
    def embed_texts(cls, texts: List[str]) -> List[List[float]]:
        """
        Generates embeddings for a list of texts using Gemini API.
        """
        cls.get_model()
        
        # Call Gemini embedding API
        # task_type="RETRIEVAL_DOCUMENT" is recommended for storing docs in a vector DB
        result = genai.embed_content(
            model="models/gemini-embedding-001",
            content=texts,
            task_type="RETRIEVAL_DOCUMENT"
        )
        
        # It returns a dictionary where 'embedding' is a list of lists of floats
        return result['embedding']
