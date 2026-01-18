"""Test script to verify AI server can start"""
import sys
import os

# Add paths
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'model_ai1')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'model_traffic2')))

try:
    print("Testing imports...")
    from integrated_runner import calculate_integrated_scenario
    from model_ai1.what_if_engine import simulate_what_if
    from model_ai1.run_model import run_model as run_basic_model
    print("[OK] All imports successful!")
    
    print("\nTesting FastAPI app creation...")
    from fastapi import FastAPI
    app = FastAPI(title="CityView Integrated AI Model")
    print("[OK] FastAPI app created successfully!")
    
    print("\nTesting uvicorn import...")
    import uvicorn
    print("[OK] Uvicorn imported successfully!")
    
    print("\n[OK] All checks passed! Server should start successfully.")
    print("\nTo start the server, run: python api_server.py")
    
except Exception as e:
    print(f"[ERROR] Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
