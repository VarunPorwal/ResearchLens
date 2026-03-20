import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "ResearchLens API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Data Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DATA_DIR: str = os.path.join(BASE_DIR, "data")
    UPLOAD_DIR: str = os.path.join(DATA_DIR, "uploads")
    INDICES_DIR: str = os.path.join(DATA_DIR, "indices")
    METADATA_DIR: str = os.path.join(DATA_DIR, "metadata")
    
    # Validation
    ALLOWED_EXTENSIONS: set = {"pdf"}
    
    # Secrets
    GEMINI_API_KEY: str = ""
    HUGGINGFACE_API_KEY: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.INDICES_DIR, exist_ok=True)
os.makedirs(settings.METADATA_DIR, exist_ok=True)
