
import sys
import os
import json

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from ai.model_traffic2.traffic_model import predict_traffic_signal
from ai.model_traffic2.traffic_what_if import simulate_what_if_scenario
from ai.model_traffic2.config import TRAFFIC_STATIONS

def run_demo():
    print("============================================================")
    print("      URBAN INTELLIGENCE MODEL V2 - FINAL DEMO      ")
    print("============================================================")

    # 1. SPATIAL SELECTION
    # Let's pick a point between Bopal and Vastrapur
    bopal = [s for s in TRAFFIC_STATIONS if s["id"] == "bopal"][0]
    vastrapur = [s for s in TRAFFIC_STATIONS if s["id"] == "vastrapur"][0]
    
    user_lat = (bopal["lat"] + vastrapur["lat"]) / 2
    user_lon = (bopal["lon"] + vastrapur["lon"]) / 2
    
    print(f"\nLOCATION: Selected Point (Lat: {user_lat:.4f}, Lon: {user_lon:.4f})")
    print("   (Interpolated between Bopal and Vastrapur stations)")

    # 2. CURRENT STATUS
    current_density = 2_500_000 # High traffic
    current_impact = predict_traffic_signal(road_density=current_density, lat=user_lat, lon=user_lon)
    
    print(f"\nCURRENT STATUS (Density: {current_density:,}):")
    print(f"   AQI Impact Factor: {current_impact:.3f} (Relative to baseline)")
    
    # 3. WHAT-IF SCENARIO
    scenario = "What if we build a bridge to reduce traffic?"
    print(f"\nSCENARIO: \"{scenario}\"")
    
    # Use the simulation engine
    result = simulate_what_if_scenario(scenario, current_density, lat=user_lat, lon=user_lon, llm_client=None)
    
    parsed = result["parsed_params"]
    print(f"   -> Action Identified: {parsed['action'].upper()}")
    print(f"   -> Expected Reduction: {parsed['magnitude_percent']}%")
    
    print("\nTEMPORAL PROJECTION (Adoption Curve):")
    print("   ------------------------------------------------")
    print("   | Period   | Traffic Change | AQI Impact Change |")
    print("   ------------------------------------------------")
    
    base_impact = result["baseline_aqi_impact"] 
    
    for period in ["1_month", "3_months", "6_months"]:
        fc = result["forecast"][period]
        diff = fc["aqi_impact"] - base_impact
        print(f"   | {period:<8} | {fc['traffic_change_pct']:>5}%        | {diff:+.3f}            |")
    print("   ------------------------------------------------")

if __name__ == "__main__":
    run_demo()
