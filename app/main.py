from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import health, ingest, chat, summarize, papers, compare, metrics

app = FastAPI(
    title="Research Agent API",
    description="Backend for RAG-based Research Paper functionality",
    version="0.1.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["System"])
app.include_router(ingest.router, prefix="/api", tags=["Ingestion"])
app.include_router(chat.router, prefix="/api", tags=["RAG"])
app.include_router(summarize.router, prefix="/api", tags=["RAG"])
app.include_router(papers.router, prefix="/api", tags=["Ingestion"])
app.include_router(compare.router, prefix="/api", tags=["RAG"])
app.include_router(metrics.router, prefix="/api", tags=["RAG"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
