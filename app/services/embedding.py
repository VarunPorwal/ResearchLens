import os
import google.generativeai as genai
from typing import List
from app.core.config import settings
from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type
from app.services.rate_limiter import api_rate_limiter

import requests
from huggingface_hub import InferenceClient

class EmbeddingService:
    @classmethod
    def get_model(cls):
        if not settings.HUGGINGFACE_API_KEY:
            raise ValueError("HUGGINGFACE_API_KEY is not set in environment or config.")

    @classmethod
    @retry(
        wait=wait_exponential(multiplier=2, min=1, max=10),
        stop=stop_after_attempt(3),
        retry=retry_if_exception_type(Exception),
        reraise=True
    )
    def _call_hf_api(cls, texts: List[str]) -> List[List[float]]:
        """Isolated call to HuggingFace Inference API for retry logic."""
        client = InferenceClient(api_key=settings.HUGGINGFACE_API_KEY)
        embeddings = client.feature_extraction(texts, model="sentence-transformers/all-MiniLM-L6-v2")
        return embeddings.tolist()
        
    @classmethod
    def embed_texts(cls, texts: List[str]) -> List[List[float]]:
        """
        Generates embeddings for a list of texts using HuggingFace API.
        """
        cls.get_model()
        
        all_embeddings = []
        batch_size = 50 # HF Inference API prefers smaller batches
        
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            
            # Call HuggingFace API with retry logic
            embeddings = cls._call_hf_api(batch)
            all_embeddings.extend(embeddings)
            
        return all_embeddings
