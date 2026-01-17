
import sys
import os
import unittest

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from ai.model_traffic2.traffic_model import predict_traffic_signal
from ai.model_traffic2.config import TRAFFIC_STATIONS

class TestSpatialPrediction(unittest.TestCase):
    
    def test_exact_match(self):
        print("\n--- Testing Exact Station Coordinates vs Station ID ---")
        
        # Test with "Bopal"
        bopal = [s for s in TRAFFIC_STATIONS if s["id"] == "bopal"][0]
        
        # 1. Prediction by ID
        impact_id = predict_traffic_signal(road_density=2000, station_id=bopal["id"])
        
        # 2. Prediction by Lat/Lon
        impact_loc = predict_traffic_signal(road_density=2000, lat=bopal["lat"], lon=bopal["lon"])
        
        print(f"ID-based impact: {impact_id}")
        print(f"Loc-based impact: {impact_loc}")
        
        # Should be nearly identical (allowing for small floating point diffs in weight calc)
        self.assertAlmostEqual(impact_id, impact_loc, places=4)
        print("Matched!")

    def test_interpolation(self):
        print("\n--- Testing Spatial Interpolation (Midpoint) ---")
        
        # Pick two stations: Bopal (Small cap) and Maninagar (Large cap)
        bopal = [s for s in TRAFFIC_STATIONS if s["id"] == "bopal"][0]
        maninagar = [s for s in TRAFFIC_STATIONS if s["id"] == "maninagar"][0]
        
        # Midpoint
        mid_lat = (bopal["lat"] + maninagar["lat"]) / 2
        mid_lon = (bopal["lon"] + maninagar["lon"]) / 2
        
        # Predict at Bopal, Maninagar, and Midpoint
        # Use realistic density (5 million) to be comparable to station means
        density = 5_000_000
        impact_bopal = predict_traffic_signal(road_density=density, lat=bopal["lat"], lon=bopal["lon"])
        impact_maninagar = predict_traffic_signal(road_density=density, lat=maninagar["lat"], lon=maninagar["lon"])
        impact_mid = predict_traffic_signal(road_density=density, lat=mid_lat, lon=mid_lon)
        
        print(f"Bopal (Small Cap) Impact:     {impact_bopal:.3f}")
        print(f"Midpoint Impact:              {impact_mid:.3f}")
        print(f"Maninagar (Large Cap) Impact: {impact_maninagar:.3f}")
        
        # For a fixed load (2000), Bopal (small) should have HIGH impact
        # Maninagar (large) should have LOW impact
        # Midpoint should be somewhere in between
        self.assertTrue(impact_mid < impact_bopal)
        self.assertTrue(impact_mid > impact_maninagar)
        print("Interpolation logic holds!")

if __name__ == "__main__":
    unittest.main()
