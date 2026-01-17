
import sys
import os
import pandas as pd

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from ai.model_traffic2.traffic_model import predict_traffic_signal, get_baseline_capacity

def test_user_coords():
    lat = 23.1175
    lon = 72.5767
    
    print(f"Testing Coordinates: {lat}, {lon}")
    
    # 1. Check Interpolated Capacity
    capacity = get_baseline_capacity(lat=lat, lon=lon)
    print(f"Interpolated Baseline Capacity: {capacity:,.0f} vehicles/hr")
    
    # 2. Run Prediction with a standard high traffic load (e.g. 2500)
    traffic_density = 2500
    impact = predict_traffic_signal(traffic_density, lat=lat, lon=lon)
    
    print(f"Traffic Input: {traffic_density} vehicles/hr")
    print(f"Predicted AQI Impact Factor: {impact:.4f}")
    
    if impact == 0.0:
         print("Note: Impact 0.0 might indicate very low normalized traffic.")

if __name__ == "__main__":
    test_user_coords()
