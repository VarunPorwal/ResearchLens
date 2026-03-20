import os
import sys

# Add the project root to the python path so imports work correctly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.services.embedding import EmbeddingService

try:
    print("Testing EmbeddingService with model literal 'models/gemini-embedding-001'...")
    texts = ["This is a test document about AI.", "This is another test document."]
    embeddings = EmbeddingService.embed_texts(texts)
    
    print(f"\nSUCCESS! Generated {len(embeddings)} embeddings.")
    print(f"Dimension of first embedding: {len(embeddings[0])}")
    print("The code is fully functioning with the Google Generative AI API.")
except Exception as e:
    print(f"\nFAILED! Error generating embeddings:")
    print(str(e))
