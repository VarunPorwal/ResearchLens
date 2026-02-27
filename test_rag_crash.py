import os
from pprint import pprint
from app.services.rag import RAGService
from app.core.config import settings
import glob
import traceback

files = glob.glob('data/metadata/*.json')
if not files:
    print("NO FILES FOUND")
else:
    file_id = os.path.basename(files[0]).replace('.json', '')
    print('Testing exact generation with key:', file_id)
    try:
        res = RAGService.summarize_document(file_id, settings.GEMINI_API_KEY)
        print("RESULT:")
        print(res)
    except Exception as e:
        print("summarize_document ERROR:")
        traceback.print_exc()
