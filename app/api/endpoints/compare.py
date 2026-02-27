from fastapi import APIRouter, HTTPException, Depends
from app.services.rag import RAGService
from app.core.auth import get_current_user
from pydantic import BaseModel
from typing import List, Optional
from app.core.config import settings
import json

router = APIRouter()

class CompareRequest(BaseModel):
    file_ids: List[str]
    query: Optional[str] = None
    api_key: Optional[str] = None


@router.post("/compare")
async def compare_papers(request: CompareRequest, user=Depends(get_current_user)):
    """
    Compare multiple papers based on a query.
    """
    api_key = request.api_key or settings.GEMINI_API_KEY
    if not api_key:
        raise HTTPException(status_code=400, detail="API Key is required")

    if len(request.file_ids) < 2:
        raise HTTPException(
            status_code=400,
            detail="At least two papers are required for comparison."
        )

    try:
        comparison_str = RAGService.compare_documents(
            request.file_ids,
            user.id,
            request.query,
            api_key
        )

        try:
            comparison_data = json.loads(comparison_str)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=500,
                detail="Failed to parse comparison JSON from language model."
            )

        return {"comparison": comparison_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))