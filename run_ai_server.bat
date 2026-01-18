@echo off
echo Starting AI Server on port 8001...

cd ai

echo Installing AI dependencies...
pip install fastapi uvicorn requests google-generativeai joblib

echo Starting AI server...
python api_server.py
