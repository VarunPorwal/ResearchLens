import requests
import os

pdf_path = "app/main.py"  # Any file just to test if the endpoint crashes? Wait, endpoints validate mime.
# Let's create a minimal valid PDF or just grab one.
# We will create a dummy PDF locally.
from reportlab.pdfgen import canvas

pdf_file = "test_reproduce.pdf"
c = canvas.Canvas(pdf_file)
c.drawString(100, 750, "Hello World from Test!")
# let's write 10 pages to ensure there's a chunking
for _ in range(10):
    c.showPage()
    c.drawString(100, 750, "More text " * 50)
c.save()

url = "http://127.0.0.1:8000/api/ingest"

# We need an authentication token since the endpoint uses get_current_user
# Actually, the frontend is hitting the API. Did the user upload a file? Yes.
# If I don't have token, I'll get 401. Let's send a fake file to see what it returns.

print("Sending request to:", url)
try:
    with open(pdf_file, "rb") as f:
        # We might get 401 without auth, but let's try
        response = requests.post(url, files={"file": ("test_reproduce.pdf", f, "application/pdf")})
        print("Status Code:", response.status_code)
        print("Response:", response.text)
except Exception as e:
    print("Exception during request:", type(e).__name__, str(e))
