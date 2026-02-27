import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
models = ['gemini-2.5-flash', 'gemini-2.0-flash-001', 'gemini-2.0-flash-lite-001', 'gemini-2.0-flash', 'gemma-3-27b-it']

print('Testing quotas...')
for m in models:
    try:
        model = genai.GenerativeModel(m)
        res = model.generate_content('Hi')
        print(f'{m}: SUCCESS - {res.text[:10]}')
    except Exception as e:
        error = str(e).replace('\n', ' ')
        if 'quota' in error.lower() or '429' in error.lower():
            print(f'{m}: QUOTA EXCEEDED')
        else:
            print(f'{m}: OTHER ERROR - {error}')
