from fastapi import APIRouter
import platform
import sys

router = APIRouter()

@router.get("/health")
async def health_check():
    """
    Detailed health check to validate system readiness.
    """
    return {
        "status": "online",
        "system": {
            "platform": platform.system(),
            "python_version": sys.version.split(" ")[0]
        },
        "message": "Research Agent Backend is ready"
    }
