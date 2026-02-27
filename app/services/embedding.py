import os
import google.generativeai as genai
from typing import List
from app.core.config import settings
from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type

class EmbeddingService:
    @classmethod
    def get_model(cls):
        # We don't need a local model anymore, just ensure Gemini is configured
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set in environment or config.")
        genai.configure(api_key=settings.GEMINI_API_KEY)

    @classmethod
    @retry(
        wait=wait_exponential(multiplier=1, min=40, max=60),
        stop=stop_after_attempt(5),
        retry=retry_if_exception_type(Exception), # Catch API errors like 429
        reraise=True
    )
    def _call_gemini_api(cls, texts: List[str]) -> dict:
        """Isolated call to Gemini API for retry logic."""
        return genai.embed_content(
            model="models/gemini-embedding-001",
            content=texts,
            task_type="RETRIEVAL_DOCUMENT"
        )
        
    @classmethod
    def embed_texts(cls, texts: List[str]) -> List[List[float]]:
        """
        Generates embeddings for a list of texts using Gemini API.
        """
        cls.get_model()
        
        # Call Gemini embedding API with retry logic
        result = cls._call_gemini_api(texts)

        
        # It returns a dictionary where 'embedding' is a list of lists of floats
        return result['embedding']
