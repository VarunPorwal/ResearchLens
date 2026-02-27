import os
from dotenv import load_dotenv
from supabase import create_client

# 1. Test Backend Config (Root .env)
print("--- Testing Backend Config (.env) ---")
load_dotenv(".env")
url = os.environ.get("SUPABASE_URL")
service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if url and service_key:
    try:
        print(f"URL: {url}")
        supabase = create_client(url, service_key)
        # Try a simple query
        response = supabase.table("profiles").select("*").limit(1).execute()
        print("Backend Connection: SUCCESS")
    except Exception as e:
        print(f"Backend Connection: FAILED - {e}")
else:
    print("Backend Connection: SKIPPED (Missing URL or Key in .env)")

# 2. Test Frontend Config (frontend/.env.local)
print("\n--- Testing Frontend Config (frontend/.env.local) ---")
load_dotenv("frontend/.env.local", override=True)
url_front = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
anon_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if url_front and anon_key:
    try:
        print(f"URL: {url_front}")
        supabase_front = create_client(url_front, anon_key)
        # We can't easily test sign up without creating a dummy user, but we can test basic init
        # Let's see if we can read from public.papers (should return empty list or fail due to RLS, but not crash on fetch)
        response = supabase_front.table("papers").select("*").limit(1).execute()
        print("Frontend Connection: SUCCESS (Connected and reached database)")
    except Exception as e:
        print(f"Frontend Connection: FAILED - {e}")
else:
    print("Frontend Connection: SKIPPED (Missing URL or Key in frontend/.env.local)")
