from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.services.ingestion import IngestionService
from app.services.embedding import EmbeddingService
from app.services.vector_store import VectorStoreService
from app.core.auth import get_current_user
from app.core.supabase_client import supabase
import os
import shutil
import uuid

router = APIRouter()

@router.post("/ingest")
async def ingest_pdf(file: UploadFile = File(...), user=Depends(get_current_user)):
    """
    Upload a PDF to Supabase, index it locally (partitioned by user).
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    file_id = str(uuid.uuid4())
    user_id = user.id
    
    # Supabase Storage path
    storage_path = f"{user_id}/{file_id}.pdf"
    
    # Local paths (partitioned by user)
    indices_dir = os.path.join("data/indices", user_id)
    metadata_dir = os.path.join("data/metadata", user_id)
    os.makedirs(indices_dir, exist_ok=True)
    os.makedirs(metadata_dir, exist_ok=True)
    
    index_path = os.path.join(indices_dir, f"{file_id}.index")
    metadata_path = os.path.join(metadata_dir, f"{file_id}.json")
    
    # We still need a temp file for extraction
    temp_path = f"data/uploads/{file_id}.pdf"
    os.makedirs("data/uploads", exist_ok=True)

    try:
        # 1. Save locally for processing
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 2. Upload to Supabase Storage
        with open(temp_path, "rb") as f:
            supabase.storage.from_("pdfs").upload(storage_path, f)

        # 3. Save to Supabase DB (Metadata)
        paper_data = {
            "id": file_id,
            "user_id": user_id,
            "filename": file.filename,
            "storage_path": storage_path,
            "title": file.filename.replace(".pdf", "")
        }
        supabase.table("papers").insert(paper_data).execute()

        # 4. Process (Extract, Chunk, Embed)
        text = IngestionService.extract_text(temp_path)
        chunks = IngestionService.chunk_text(text)
        embeddings = EmbeddingService.embed_texts(chunks)
        
        # 5. Index and Metadata (Local Partitioned)
        index = VectorStoreService.create_index()
        VectorStoreService.add_vectors(index, embeddings)
        VectorStoreService.save_index(index, index_path)
        
        chunk_metadata = {}
        for i, chunk in enumerate(chunks):
            chunk_metadata[str(i)] = {
                "text": chunk,
                "source": file.filename,
                "file_id": file_id
            }
        
        VectorStoreService.save_metadata(chunk_metadata, metadata_path)
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "chunks_count": len(chunks),
            "message": "Successfully processed and indexed PDF for user"
        }
        
    except Exception as e:
        print(f"Ingestion error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
