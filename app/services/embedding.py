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
        wait=wait_exponential(multiplier=2, min=10, max=60),
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
        Respects the 1000 requests / minute rate limit by batching.
        """
        import time
        cls.get_model()
        
        all_embeddings = []
        batch_size = 5 # Google's free tier for Gemini can be extremely strict. 
        
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            
            # Call Gemini embedding API with retry logic
            result = cls._call_gemini_api(batch)
            all_embeddings.extend(result['embedding'])
            
            # Sleep aggressively to avoid hitting the Quota Exhaustion
            if i + batch_size < len(texts):
                time.sleep(3)
        
        return all_embeddings
