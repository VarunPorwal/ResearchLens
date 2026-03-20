import os
import sys

# Add the project root to the python path so imports work correctly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.embedding import EmbeddingService

try:
    print("Testing EmbeddingService with larger payload...")
    # Generate 50 texts of 200 words each to simulate a full batch
    texts = ["This is a test document about AI. " * 50 for _ in range(50)]
    embeddings = EmbeddingService.embed_texts(texts)
    print(f"SUCCESS! Generated {len(embeddings)} embeddings.")
except Exception as e:
    import traceback
    print("FAILED! Error generating embeddings:")
    traceback.print_exc()
