import pytest
from app.services.ingestion import IngestionService
from pypdf import PdfWriter, PageObject
import os

# Helper to create a dummy PDF
def create_dummy_pdf(filename, content="Hello World"):
    writer = PdfWriter()
    page = PageObject.create_blank_page(width=100, height=100)
    # We can't easily add text with pypdf without complex operations or reportlab.
    # So we will mock the PdfReader in the service test OR just test the chunking logic 
    # and integration test the extraction if we have a sample PDF.
    
    # Actually, let's just test chunking logic unit first, 
    # and then use a mocked Reader for extract_text to avoid binary file complexity.
    pass

def test_chunking_logic():
    text = "0123456789" * 10  # 100 characters
    # Chunk size 20, overlap 5
    # Chunks: 
    # 1. 0-20
    # 2. 15-35
    # 3. 30-50
    chunks = IngestionService.chunk_text(text, chunk_size=20, overlap=5)
    
    assert len(chunks) > 0
    assert len(chunks[0]) == 20
    assert chunks[0] == "01234567890123456789"
    assert chunks[1].startswith("56789") # Overlap check

def test_clean_text():
    dirty = "Hello   \n\n World"
    clean = IngestionService._clean_text(dirty)
    assert clean == "Hello \n World"

# For extraction, since we don't have a sample PDF easily, we can mock pypdf.PdfReader
from unittest.mock import MagicMock, patch

@patch('pypdf.PdfReader')
def test_extract_text(mock_reader_cls):
    # Setup mock
    mock_page = MagicMock()
    mock_page.extract_text.return_value = "Page text."
    
    mock_reader = MagicMock()
    mock_reader.pages = [mock_page, mock_page]
    
    mock_reader_cls.return_value = mock_reader
    
    # Run
    text = IngestionService.extract_text("dummy.pdf")
    
    # Verify
    assert "Page text." in text
    assert text.count("Page text.") == 2
