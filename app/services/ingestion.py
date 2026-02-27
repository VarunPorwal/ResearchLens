import pypdf
from typing import List
import re

class IngestionService:
    @staticmethod
    def extract_text(file_path: str) -> str:
        """
        Extracts text from a PDF file.
        """
        text = ""
        try:
            reader = pypdf.PdfReader(file_path)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        except Exception as e:
            raise ValueError(f"Failed to extract text from PDF: {str(e)}")
        
        return IngestionService._clean_text(text)

    @staticmethod
    def _clean_text(text: str) -> str:
        """
        Basic text cleaning: removes excessive whitespace.
        """
        # Remove multiple newlines and extra spaces
        text = re.sub(r'\n+', '\n', text)
        text = re.sub(r'[ \t]+', ' ', text)
        return text.strip()

    @staticmethod
    def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        """
        Splits text into overlapping chunks.
        """
        if not text:
            return []
            
        chunks = []
        start = 0
        text_len = len(text)

        while start < text_len:
            end = start + chunk_size
            chunk = text[start:end]
            chunks.append(chunk)
            # Move forward by chunk_size - overlap
            start += (chunk_size - overlap)
        
        return chunks
