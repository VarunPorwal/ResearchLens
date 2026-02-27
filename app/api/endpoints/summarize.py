from fastapi import APIRouter, HTTPException, Depends
from app.services.rag import RAGService
from app.models.summary import StructuredSummary
from app.core.auth import get_current_user
from pydantic import BaseModel
import json
import os

router = APIRouter()

from typing import Optional
from app.core.config import settings

class SummarizeRequest(BaseModel):
    file_id: str
    api_key: Optional[str] = None

@router.post("/summarize")
async def summarize(request: SummarizeRequest, user=Depends(get_current_user)):
    """
    Generate a structured summary for a document.
    """
    api_key = request.api_key or settings.GEMINI_API_KEY
    if not api_key:
        raise HTTPException(status_code=400, detail="API Key is required")

    user_id = user.id
    
    # Check if index exists in user-partitioned directory
    index_path = os.path.join("data/indices", user_id, f"{request.file_id}.index")
    if not os.path.exists(index_path):
        raise HTTPException(status_code=404, detail="Document not found or not processed for this user")

    # Setup caching directory (partitioned by user)
    summaries_dir = os.path.join("data/summaries", user_id)
    os.makedirs(summaries_dir, exist_ok=True)
    cache_path = os.path.join(summaries_dir, f"{request.file_id}.json")

    # 1. Check if summary already exists on disk
    if os.path.exists(cache_path):
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                cached_data = json.load(f)
                return {"summary": cached_data}
        except Exception as e:
            print(f"Failed to read cached summary: {e}")
            # Fall through to regenerate if cache is corrupted

    try:
        # 2. Generate new summary via RAG Service
        json_str = RAGService.summarize_document(request.file_id, api_key, user_id)
        
        # The LLM might return "Error: ..." string if it fails, so we need to handle that.
        if json_str.startswith("Error"):
             raise HTTPException(status_code=500, detail=json_str)

        try:
            summary_data = json.loads(json_str)
            
            # Check for inner error message returned as JSON
            if "error" in summary_data:
                raise HTTPException(status_code=500, detail=summary_data["error"])
                
            # 3. Save directly to disk cache
            with open(cache_path, "w", encoding="utf-8") as f:
                json.dump(summary_data, f, indent=2, ensure_ascii=False)
                
            return {"summary": summary_data}
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="LLM failed to generate valid JSON")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
