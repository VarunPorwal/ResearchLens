import pytest
import numpy as np
import os
import shutil
from app.services.vector_store import VectorStoreService

TEST_INDEX_PATH = "test_index.faiss"
TEST_METADATA_PATH = "test_metadata.json"

@pytest.fixture(autouse=True)
def cleanup():
    yield
    if os.path.exists(TEST_INDEX_PATH):
        os.remove(TEST_INDEX_PATH)
    if os.path.exists(TEST_METADATA_PATH):
        os.remove(TEST_METADATA_PATH)

def test_vector_store_workflow():
    # 1. Create Index
    index = VectorStoreService.create_index(dimension=4)
    
    # 2. Add Vectors (3 vectors of dim 4)
    vectors = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0]
    ]
    VectorStoreService.add_vectors(index, vectors)
    assert index.ntotal == 3

    # 3. Save Index
    VectorStoreService.save_index(index, TEST_INDEX_PATH)
    assert os.path.exists(TEST_INDEX_PATH)

    # 4. Load Index
    loaded_index = VectorStoreService.load_index(TEST_INDEX_PATH)
    assert loaded_index.ntotal == 3

    # 5. Search
    # Query close to the first vector
    distance, indices = VectorStoreService.search(loaded_index, [0.9, 0.1, 0.0, 0.0], k=1)
    assert indices[0] == 0  # Should match the first vector

def test_metadata_operations():
    metadata = {
        "0": {"text": "Chunk 1", "source": "doc1"},
        "1": {"text": "Chunk 2", "source": "doc1"}
    }
    VectorStoreService.save_metadata(metadata, TEST_METADATA_PATH)
    assert os.path.exists(TEST_METADATA_PATH)
    
    loaded = VectorStoreService.load_metadata(TEST_METADATA_PATH)
    assert loaded["0"]["text"] == "Chunk 1"
