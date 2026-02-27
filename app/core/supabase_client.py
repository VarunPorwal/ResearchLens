from supabase import create_client, Client
from app.core.config import settings

def get_supabase() -> Client:
    # Use the SERVICE_ROLE_KEY to bypass RLS securely from the backend
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

# Singleton instance
supabase: Client = get_supabase()
