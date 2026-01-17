import pandas as pd
import numpy as np
from ai.model_traffic2.traffic_model import predict_traffic_signal, get_baseline_capacity
from ai.model_traffic2.llm_parser import parse_what_if_scenario

def simulate_what_if_scenario(scenario_text, current_road_density, station_id=None, lat=None, lon=None, llm_client=None):
    """
    Simulates a traffic scenario and projects AQI impact over 1, 3, and 6 months.
    Now supports spatial prediction if lat/lon provided.
    
    Args:
        scenario_text (str): "What if we build a bridge?"
        current_road_density (float): 2000
        station_id (str): Optional "bopal"
        lat, lon (float): Optional coordinates for spatial prediction
        llm_client: Client for LLM parsing (optional)
        
    Returns:
        dict: Forecast results
    """
    
    # 1. Parse Scenario
    params = parse_what_if_scenario(llm_client, scenario_text)
    
    target_magnitude = params["magnitude_percent"]
    action = params["action"]
    
    # DYNAMIC SCALING LOGIC (User Request)
    # If adding infrastructure (bridge/metro), scale impact based on utilization
    if action == "add_infrastructure":
        baseline_capacity = get_baseline_capacity(station_id, lat, lon)
        utilization = current_road_density / baseline_capacity
        
        # Logic: Higher utilization = Higher impact
        # Base impact from parser (e.g. 15%) is for normal utilization (~1.0)
        # Scale factor: 0.5x if empty road, 1.5x if jammed
        
        scale_factor = min(max(utilization, 0.5), 1.5) # Clamp between 0.5 and 1.5
        target_magnitude = target_magnitude * scale_factor
        
        # Update params for display
        params["magnitude_percent"] = round(target_magnitude, 1)
        params["note"] = f"Dynamic Impact: scaled by {scale_factor:.2f}x based on traffic density"
    
    # Sign correction
    if action == "reduce" or action == "add_infrastructure":
        target_change = -target_magnitude / 100.0
    else:
        target_change = target_magnitude / 100.0
        
    # 2. Baseline Prediction
    base_impact = predict_traffic_signal(current_road_density, station_id=station_id, lat=lat, lon=lon)
    
    # 3. Temporal Projection (Adoption Curve)
    # Construction usually takes time to have full effect
    # Immediate reduction usually ramps up
    
    adoption_curve = {
        1: 0.4,  # Month 1: 40% effect
        3: 0.8,  # Month 3: 80% effect
        6: 1.0   # Month 6: 100% effect
    }
    
    forecast = {}
    
    for month, adoption in adoption_curve.items():
        # effective change at this month
        effective_change = target_change * adoption
        
        # Calculate modified density
        # We assume density changes proportionally to the traffic flow change
        new_density = current_road_density * (1 + effective_change)
        
        # 🔥 DEEP DEPENDENCY: Run the AI Model on the new density
        # This ensures we capture the non-linear or normalized behavior of the specific station
        new_impact = predict_traffic_signal(new_density, station_id=station_id, lat=lat, lon=lon)
        
        suffix = "s" if month > 1 else ""
        forecast[f"{month}_month{suffix}"] = {
            "aqi_impact": float(new_impact),
            "traffic_change_pct": round(effective_change * 100, 1),
            "density_used": round(new_density, 0)
        }
        
    return {
        "baseline_aqi_impact": float(base_impact),
        "parsed_params": params,
        "forecast": forecast
    }
