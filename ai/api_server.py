from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os
import sys
import requests
import json
from datetime import datetime

# Ensure modules are importable
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'model_ai1')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'model_traffic2')))

from integrated_runner import calculate_integrated_scenario
from model_ai1.what_if_engine import simulate_what_if
from model_ai1.run_model import run_model as run_basic_model

app = FastAPI(title="CityView Integrated AI Model")

# API Keys from environment
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
OPENAI_OSS_API_KEY = os.getenv("OPENAI_OSS_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

class SimulationRequest(BaseModel):
    lat: float
    lon: float
    scenario: str
    duration_months: int = 6

class BasicPredictionRequest(BaseModel):
    lat: float
    lon: float

def call_meta_llama(prompt: str, api_key: str = None) -> str:
    """Call Groq Meta Llama 3.3 70B model for reasoning"""
    key_to_use = api_key or GROQ_API_KEY
    if not key_to_use:
        # Fallback reasoning if no Groq key
        return "Reasoning temporarily limited: Groq API key missing."
    
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {key_to_use}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": "You are an urban planning AI assistant. Provide realistic impact scores (0-100) and reasoning for city scenarios."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 1000,
        "response_format": {"type": "json_object"}
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Meta Llama API Error: {e}")
        return json.dumps({
            "reasoning": f"AI reasoning service encountered an error: {str(e)}",
            "healthcare_impact_score": 70,
            "schools_impact_score": 85,
            "urban_dev_impact_score": 75
        })

@app.post("/api/basic-predict")
async def basic_predict(request: BasicPredictionRequest):
    """
    Basic AQI prediction without any scenario/project logic.
    Just runs run_model.py directly to get 1/3/6 month forecasts.
    """
    try:
        print(f"Running basic prediction for location: {request.lat}, {request.lon}")
        
        # Call run_model directly - no scenario, no projects, just pure forecasting
        result = run_basic_model(request.lat, request.lon)
        
        # Format response to match frontend expectations
        aqi_3m = result["aqi"]["3_month"]
        aqi_6m = result["aqi"]["6_month"]
        # Interpolate between 3 and 6 months for 5 month prediction
        interpolated_5m = aqi_3m + ((aqi_6m - aqi_3m) * (2/3))  # 2/3 of the way from 3 to 6
        
        response = {
            "predictions": {
                "1_month": {
                    "aqi": result["aqi"]["1_month"],
                    "confidence": result["confidence"]["1_month"],
                    "baseline_aqi": result["aqi"]["1_month"],  # For 1 month, baseline = prediction
                    "impact_percentage": 0,  # No project, so no impact
                },
                "3_month": {
                    "aqi": result["aqi"]["3_month"],
                    "confidence": result["confidence"]["3_month"],
                    "baseline_aqi": result["aqi"]["3_month"],
                    "impact_percentage": 0,
                },
                "5_month": {
                    "aqi": round(interpolated_5m, 2),
                    "confidence": result["confidence"]["6_month"],  # Use 6 month confidence as approximation
                    "baseline_aqi": round(interpolated_5m, 2),
                    "impact_percentage": 0,
                },
                "6_month": {
                    "aqi": result["aqi"]["6_month"],
                    "confidence": result["confidence"]["6_month"],
                    "baseline_aqi": result["aqi"]["6_month"],
                    "impact_percentage": 0,
                }
            },
            "station_influence": result.get("station_influence", {}),
            "details": {
                "reasoning": "Basic AQI forecast using Prophet time-series model. No project scenarios applied.",
                "traffic_change_percent": 0,
                "construction_phase": "None",
                "model_type": "Prophet Time-Series Forecast"
            }
        }
        
        return response
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Basic prediction error: {str(e)}")

@app.post("/predict")
async def predict_impact(request: SimulationRequest):
    """
    Unified endpoint for full infrastructure impact analysis.
    Combines Technical models (AQI, Traffic) with LLM reasoning.
    """
    try:
        print(f"Processing scenario: {request.scenario} at {request.lat}, {request.lon}")
        
        # 1. Run Technical Integrated Models (Traffic + AQI)
        tech_result = calculate_integrated_scenario(request.lat, request.lon, request.scenario)
        
        if "error" in tech_result and tech_result["error"] != "GEMINI_API_KEY_MISSING":
             raise HTTPException(status_code=500, detail=tech_result["error"])

        # 2. Get Broader Impact Reasoning from Llama (Healthcare, Schools, etc.)
        reasoning_prompt = f"""
        Analyze the impact of this urban scenario for Ahmedabad:
        Scenario: {request.scenario}
        Technical baseline: AQI {tech_result.get('baseline_aqi')}, Traffic Change {tech_result.get('traffic_prediction', {}).get('traffic_impact')}%
        
        Return a JSON object with:
        - "reasoning": 2-3 sentence explanation of systemic impacts.
        - "healthcare_impact_score": (0-100, where 100 is excellent)
        - "schools_impact_score": (0-100)
        - "urban_dev_impact_score": (0-100)
        """
        
        reasoning_json_str = call_meta_llama(reasoning_prompt)
        try:
            reasoning_data = json.loads(reasoning_json_str)
        except:
            reasoning_data = {
                "reasoning": "Standard urban development impact expected.",
                "healthcare_impact_score": 75,
                "schools_impact_score": 80,
                "urban_dev_impact_score": 70
            }

        # 3. Consolidate Result
        response = {
            "annotated_aqi": round(tech_result.get("final_aqi", 150), 2),
            "baseline_aqi": round(tech_result.get("baseline_aqi", 150), 2),
            "impact_percentage": round(tech_result.get("traffic_aqi_shift", 0) / tech_result.get("baseline_aqi", 150) * 100, 2) if tech_result.get("baseline_aqi") else 0,
            "details": {
                "traffic_change_percent": tech_result.get("traffic_prediction", {}).get("traffic_impact", 0),
                "healthcare_index": reasoning_data.get("healthcare_impact_score", 75),
                "schools_index": reasoning_data.get("schools_impact_score", 80),
                "urban_dev_index": reasoning_data.get("urban_dev_impact_score", 70),
                "reasoning": reasoning_data.get("reasoning", ""),
                "technical_details": tech_result
            }
        }
        
        return response

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/models/files")
async def list_model_files():
    """List available model files"""
    try:
        base_dir = os.path.dirname(__file__)
        model_dirs = ["model_ai1", "model_traffic2"]
        files_data = []
        for model_dir in model_dirs:
            dir_path = os.path.join(base_dir, model_dir)
            if os.path.exists(dir_path):
                for root, _, files in os.walk(dir_path):
                    for file in files:
                        if file.endswith(('.py', '.json', '.txt', '.md', '.pkl')):
                            file_path = os.path.join(root, file)
                            rel_path = os.path.relpath(file_path, base_dir)
                            stats = os.stat(file_path)
                            content = "[Binary File]"
                            if file.endswith(('.py', '.json', '.txt', '.md')):
                                try:
                                    with open(file_path, 'r', encoding='utf-8') as f:
                                        content = f.read()
                                except:
                                    content = "[Binary or Non-UTF8 Content]"
                            files_data.append({
                                "name": file, "path": rel_path, "size": stats.st_size,
                                "type": "model" if file.endswith('.pkl') else "code",
                                "content": content
                            })
        return {"files": files_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
