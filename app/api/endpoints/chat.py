from fastapi import APIRouter, HTTPException, Body, Depends
from app.services.rag import RAGService
from app.core.auth import get_current_user
from pydantic import BaseModel
import os

router = APIRouter()

from app.core.config import settings
from typing import Optional

class ChatRequest(BaseModel):
    query: str
    file_id: str
    api_key: Optional[str] = None  # Optional now

@router.post("/chat")
async def chat(request: ChatRequest, user=Depends(get_current_user)):
    """
    Ask a question about a specific document.
    """
    api_key = request.api_key or settings.GEMINI_API_KEY
    if not api_key:
        raise HTTPException(status_code=400, detail="API Key is required (provide in request or .env)")

    user_id = user.id
    if not os.path.exists(os.path.join("data/indices", user_id, f"{request.file_id}.index")):
        raise HTTPException(status_code=404, detail="Document not found or not processed")

    try:
        result = RAGService.answer_question(request.query, request.file_id, api_key, user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
