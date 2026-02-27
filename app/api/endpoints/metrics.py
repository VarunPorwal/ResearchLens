from fastapi import APIRouter, HTTPException, Depends
from app.services.rag import RAGService
from app.models.metrics import ExtractedMetrics
from app.core.auth import get_current_user
from pydantic import BaseModel
import json
import os

router = APIRouter()

from typing import Optional
from app.core.config import settings

class MetricsRequest(BaseModel):
    file_id: str
    api_key: Optional[str] = None

@router.post("/metrics")
async def extract_metrics(request: MetricsRequest, user=Depends(get_current_user)):
    """
    Extract visualization-ready metrics from a document.
    """
    api_key = request.api_key or settings.GEMINI_API_KEY
    if not api_key:
        raise HTTPException(status_code=400, detail="API Key is required")

    user_id = user.id
    if not os.path.exists(os.path.join("data/indices", user_id, f"{request.file_id}.index")):
        raise HTTPException(status_code=404, detail="Document not found")

    try:
        json_str = RAGService.extract_metrics(request.file_id, api_key, user_id)
        
        if json_str.startswith("Error"):
             raise HTTPException(status_code=500, detail=json_str)

        try:
            data = json.loads(json_str)
            # Transform to Pydantic model
            metrics = ExtractedMetrics(paper_id=request.file_id, metrics=data.get("metrics", []))
            return metrics
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="LLM failed to generate valid JSON")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
