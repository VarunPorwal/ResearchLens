@echo off
echo Setting up Research Agent Environment...
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
pip install pytest httpx
echo Setup Complete!
