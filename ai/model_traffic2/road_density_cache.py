from ai.model_traffic2.road_density import compute_road_density
from ai.model_traffic2.config import TRAFFIC_STATIONS
import json
import os

CACHE_FILE = os.path.join(os.path.dirname(__file__), "road_density_cache.json")

def build_road_density_cache():
    cache = {}
    for s in TRAFFIC_STATIONS:
        print(f"Computing road density for {s['id']}...")
        cache[s["id"]] = compute_road_density(s["lat"], s["lon"])

    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f)

    print("Road density cache saved.")

if __name__ == "__main__":
    build_road_density_cache()
