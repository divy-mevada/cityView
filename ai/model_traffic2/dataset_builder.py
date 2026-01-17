from ai.model_traffic2.activity_density import compute_activity_density
from ai.model_traffic2.population_density import get_population_density
from ai.model_traffic2.config import TRAFFIC_STATIONS
import pandas as pd
import json
import os
import numpy as np
from math import sin, pi

# ---------- Load cached road density ----------
CACHE_FILE = os.path.join(os.path.dirname(__file__), "road_density_cache.json")
with open(CACHE_FILE, "r") as f:
    ROAD_DENSITY_MAP = json.load(f)

# ---------- Base dataset builder ----------
def build_dataset(df):
    df = df.copy()
    df["timestamp"] = pd.to_datetime(df["timestamp"])

    df["hour"] = df["timestamp"].dt.hour
    df["month"] = df["timestamp"].dt.month
    df["is_weekend"] = (df["timestamp"].dt.weekday >= 5).astype(int)

    df["road_density"] = df["station"].map(ROAD_DENSITY_MAP)
    df["population_density"] = df["station"].apply(get_population_density)

    df["activity_density"] = df.apply(
        lambda x: compute_activity_density(
            x["population_density"], x["hour"]
        ),
        axis=1
    )

    df["traffic_signal"] = df["activity_density"] * df["road_density"]

    df["baseline_aqi"] = df.groupby("station")["observed_aqi"].transform("mean")
    df["aqi_change"] = (
        df["observed_aqi"] - df["baseline_aqi"]
    ) / df["baseline_aqi"]

    return df[[
        "hour",
        "is_weekend",

        "month",
        "traffic_signal",
        "station",  # Keep station for normalization
        "aqi_change"
    ]]

# ---------- Temporal expansion (CRITICAL) ----------
def expand_temporally(df, days=30):
    expanded = []

    for _, row in df.iterrows():
        for d in range(days):
            row_copy = row.copy()

            hour = (row["hour"] + d) % 24
            
            # 🔥 UPDATE ROW COPY
            row_copy["hour"] = hour
            row_copy["is_weekend"] = 1 if (row["is_weekend"] or (d % 7 >= 5)) else 0  # Simplified logic
            
            diurnal_factor = 1 + 0.25 * sin((hour / 24) * 2 * pi)
            weekend_factor = 0.9 if row_copy["is_weekend"] else 1.1
            epsilon = np.random.normal(0, 0.02)

            traffic_factor = diurnal_factor * weekend_factor * (1 + epsilon)

            row_copy["traffic_signal"] *= traffic_factor
            row_copy["aqi_change"] = 0.4 * (traffic_factor - 1)

            expanded.append(row_copy)

    expanded_df = pd.DataFrame(expanded)



    # 🔥 NORMALIZE: Compute mean traffic per station to create "Intensity"
    station_means = expanded_df.groupby("station")["traffic_signal"].mean()
    expanded_df["traffic_signal_norm"] = expanded_df.apply(
        lambda x: x["traffic_signal"] / station_means[x["station"]], axis=1
    )
    
    # Save means for inference
    mean_map_path = os.path.join(os.path.dirname(__file__), "station_traffic_means.json")
    with open(mean_map_path, "w") as f:
        json.dump(station_means.to_dict(), f)



    return expanded_df[[
        "hour",
        "is_weekend",
        "month",
        "traffic_signal_norm",
        "aqi_change"
    ]]
