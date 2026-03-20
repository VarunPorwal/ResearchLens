import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
import numpy as np

load_dotenv()
api_key = os.environ.get("HUGGINGFACE_API_KEY")

try:
    client = InferenceClient(api_key=api_key)
    embeddings = client.feature_extraction("Hello world", model="sentence-transformers/all-MiniLM-L6-v2")
    if isinstance(embeddings, np.ndarray):
        print("Success! Dimensions:", embeddings.shape)
    else:
        print("Success! Type:", type(embeddings))
except Exception as e:
    print("Error:", str(e))
