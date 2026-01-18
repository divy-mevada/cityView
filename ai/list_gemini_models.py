import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

with open("models.txt", "w") as f:
    if not api_key:
        f.write("API_KEY_NOT_FOUND")
    else:
        genai.configure(api_key=api_key)
        try:
            models = [m.name for m in genai.list_models()]
            f.write("\n".join(models))
        except Exception as e:
            f.write(f"ERROR: {e}")
