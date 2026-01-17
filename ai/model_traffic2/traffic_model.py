import joblib
from datetime import datetime
import os
import json
import pandas as pd

from ai.model_traffic2.activity_density import compute_activity_density
from ai.model_traffic2.population_density import get_population_density

BASE_DIR = os.path.dirname(__file__)
model = joblib.load(os.path.join(BASE_DIR, "traffic_ai_model.pkl"))


from ai.model_traffic2.config import TRAFFIC_STATIONS

def get_interpolated_capacity(lat, lon, station_means):
    """
    Calculates weighted baseline capacity based on 3 nearest stations.
    Inverse Distance Weighting (IDW).
    """
    distances = []
    for s in TRAFFIC_STATIONS:
        # Euclidean distance (sufficient for city scale)
        d = ((s["lat"] - lat)**2 + (s["lon"] - lon)**2)**0.5
        distances.append((d, s["id"]))
    
    # Sort by distance
    distances.sort(key=lambda x: x[0])
    nearest = distances[:3]
    
    total_weight = 0
    weighted_sum = 0
    
    for dist, sid in nearest:
        # Avoid division by zero if exact match
        if dist < 0.0001:
            return station_means.get(sid, 1000)
            
        weight = 1 / (dist**2)
        mean_val = station_means.get(sid, 1000) # Default fallback
        
        weighted_sum += weight * mean_val
        total_weight += weight
        
    return weighted_sum / total_weight

def get_baseline_capacity(station_id=None, lat=None, lon=None):
    """
    Helper to get baseline capacity for external modules.
    """
    means_path = os.path.join(BASE_DIR, "station_traffic_means.json")
    station_means = {}
    if os.path.exists(means_path):
        with open(means_path, "r") as f:
            station_means = json.load(f)
            
    if lat is not None and lon is not None:
        return get_interpolated_capacity(lat, lon, station_means)
    elif station_id:
        return station_means.get(
            station_id,
            sum(station_means.values()) / len(station_means) if station_means else 1000
        )
    return 1000

def predict_traffic_signal(road_density, station_id=None, lat=None, lon=None):
    """
    Predict normalized traffic impact using AI-trained model.
    Supports either station_id OR (lat, lon).
    """
    
    # Use helper for consistency
    avg_traffic = get_baseline_capacity(station_id, lat, lon)

    # Normalize Input
    traffic_signal_norm = road_density / avg_traffic

    # 🔥 MATCH TRAINING SHAPE EXACTLY
    X = pd.DataFrame(
        [[traffic_signal_norm]],
        columns=["traffic_signal_norm"]
    )

    impact = model.predict(X)[0]

    # Clamp for realism
    impact = max(min(impact, 0.6), -0.3)

    return impact
