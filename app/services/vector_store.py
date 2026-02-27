import faiss
import numpy as np
import pickle
import os
import json
from typing import List, Dict, Tuple

class VectorStoreService:
    @staticmethod
    def create_index(dimension: int = 768):
        """
        Creates a new FAISS index. Gemini text-embedding-004 uses 768 dimensions.
        """
        # IndexFlatIP for Inner Product (cosine similarity if normalized)
        index = faiss.IndexFlatIP(dimension)
        return index

    @staticmethod
    def add_vectors(index, vectors: List[List[float]]):
        """
        Adds vectors to the index.
        """
        if not vectors:
            return
        
        np_vectors = np.array(vectors).astype('float32')
        index.add(np_vectors)

    @staticmethod
    def save_index(index, index_path: str):
        """
        Saves the FAISS index to disk.
        """
        faiss.write_index(index, index_path)

    @staticmethod
    def load_index(index_path: str):
        """
        Loads the FAISS index from disk.
        """
        if not os.path.exists(index_path):
            raise FileNotFoundError(f"Index not found at {index_path}")
        return faiss.read_index(index_path)

    @staticmethod
    def save_metadata(metadata: Dict, metadata_path: str):
        """
        Saves metadata (text chunks) to a JSON file.
        """
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, ensure_ascii=False, indent=2)

    @staticmethod
    def load_metadata(metadata_path: str) -> Dict:
        """
        Loads metadata from a JSON file.
        """
        if not os.path.exists(metadata_path):
            raise FileNotFoundError(f"Metadata not found at {metadata_path}")
        with open(metadata_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    @staticmethod
    def search(index, query_vector: List[float], k: int = 5) -> Tuple[List[float], List[int]]:
        """
        Searches the index for the k nearest neighbors.
        Returns distances and indices.
        """
        np_query = np.array([query_vector]).astype('float32')
        distances, indices = index.search(np_query, k)
        return distances[0].tolist(), indices[0].tolist()
