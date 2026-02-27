from fastapi import APIRouter, HTTPException, Path, Depends
from app.core.auth import get_current_user
from app.core.supabase_client import supabase
import os
import json
from typing import List, Dict
from app.core.config import settings

router = APIRouter()

@router.get("/papers")
async def list_papers(user=Depends(get_current_user)):
    """
    List all papers belonging to the current user.
    """
    try:
        # Fetch from Supabase instead of local disk listing
        res = supabase.table("papers").select("*").eq("user_id", user.id).execute()
        
        papers = []
        for p in res.data:
            papers.append({
                "file_id": p["id"],
                "filename": p["filename"],
                # We can't easily get chunks count without loading local JSON
                # but for listing, we can just return what we have in DB
                "chunks_count": 0 
            })
            
        return {"papers": papers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/papers/{file_id}")
async def get_paper_details(file_id: str, user=Depends(get_current_user)):
    """
    Get details for a specific paper, ensuring it belongs to the user.
    """
    # Verify ownership in DB
    res = supabase.table("papers").select("*").eq("id", file_id).eq("user_id", user.id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Paper not found")
        
    paper = res.data[0]
    
    # Load additional details from local metadata if needed
    metadata_path = os.path.join("data/metadata", user.id, f"{file_id}.json")
    chunks_count = 0
    if os.path.exists(metadata_path):
        try:
            with open(metadata_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                chunks_count = len(data)
        except:
            pass

    return {
        "file_id": file_id,
        "filename": paper["filename"],
        "chunks_count": chunks_count,
        "created_at": paper["created_at"]
    }

@router.delete("/papers/{file_id}")
async def delete_paper(file_id: str, user=Depends(get_current_user)):
    """
    Delete a paper (Cloud storage, DB, and local index).
    """
    # 1. Verify ownership and get storage path
    res = supabase.table("papers").select("*").eq("id", file_id).eq("user_id", user.id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    paper = res.data[0]
    storage_path = paper["storage_path"]
    
    deleted_components = []
    
    try:
        # 2. Delete from Supabase Storage
        supabase.storage.from_("pdfs").remove([storage_path])
        deleted_components.append("cloud_storage")
        
        # 3. Delete from Supabase DB
        supabase.table("papers").delete().eq("id", file_id).execute()
        deleted_components.append("database")
        
        # 4. Delete local files
        metadata_path = os.path.join("data/metadata", user.id, f"{file_id}.json")
        index_path = os.path.join("data/indices", user.id, f"{file_id}.index")
        
        if os.path.exists(metadata_path):
            os.remove(metadata_path)
            deleted_components.append("local_metadata")
            
        if os.path.exists(index_path):
            os.remove(index_path)
            deleted_components.append("local_index")
            
        return {"message": "Paper deleted successfully", "deleted_components": deleted_components}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
