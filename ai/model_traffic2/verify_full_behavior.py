
import sys
import os
import pandas as pd
import unittest
from unittest.mock import patch
from datetime import datetime

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from ai.model_traffic2.traffic_model import predict_traffic_signal
from ai.model_traffic2.traffic_to_aqi import apply_traffic_to_aqi

class TestTrafficModelFull(unittest.TestCase):
    
    def test_density_impact(self):
        print("\n--- Testing Road Density Impact (Station: bopal, Hour: 12:00) ---")
        # Mock time to Monday 12:00
        mock_now = datetime(2023, 10, 2, 12, 0, 0)
        
        with patch("ai.model_traffic2.traffic_model.datetime") as mock_dt:
            mock_dt.now.return_value = mock_now
            mock_dt.side_effect = lambda *args, **kw: datetime(*args, **kw)
            
            densities = [500, 1500, 3000, 5000]
            for d in densities:
                impact = predict_traffic_signal(road_density=d, station_id="bopal")
                print(f"Density: {d:<5} -> AQI Change: {impact:.2%}")
                
    def test_time_impact(self):
        print("\n--- Testing Time of Day Impact (Station: bopal, Density: 2000) ---")
        hours = [4, 8, 12, 18, 23] # Early morning, Morning Peak, Noon, Evening Peak, Night
        
        for h in hours:
            mock_now = datetime(2023, 10, 2, h, 0, 0) # Monday
            with patch("ai.model_traffic2.traffic_model.datetime") as mock_dt:
                mock_dt.now.return_value = mock_now
                mock_dt.side_effect = lambda *args, **kw: datetime(*args, **kw)
                
                impact = predict_traffic_signal(road_density=2000, station_id="bopal")
                print(f"Hour: {h:02d}:00 -> AQI Change: {impact:.2%}")

    def test_weekend_impact(self):
        print("\n--- Testing Weekend vs Weekday (Station: bopal, Density: 2000, Hour: 12:00) ---")
        dates = [
            (datetime(2023, 10, 2, 12, 0, 0), "Monday (Weekday)"),
            (datetime(2023, 10, 7, 12, 0, 0), "Saturday (Weekend)")
        ]
        
        for dt, label in dates:
             with patch("ai.model_traffic2.traffic_model.datetime") as mock_dt:
                mock_dt.now.return_value = dt
                mock_dt.side_effect = lambda *args, **kw: datetime(*args, **kw)
                
                impact = predict_traffic_signal(road_density=2000, station_id="bopal")
                print(f"{label:<16} -> AQI Change: {impact:.2%}")

    def test_station_invariance(self):
         print("\n--- Testing Station Normalization (Density: 2000, Hour: 12:00) ---")
         # Check if different stations with same density produce consistent normalized results
         # Note: Since we normalize by station mean, the same absolute density might imply
         # different relative intensities for different stations.
         
         stations = ["bopal", "maninagar", "naroda"]
         mock_now = datetime(2023, 10, 2, 12, 0, 0)
         
         with patch("ai.model_traffic2.traffic_model.datetime") as mock_dt:
            mock_dt.now.return_value = mock_now
            mock_dt.side_effect = lambda *args, **kw: datetime(*args, **kw)
            
            for s in stations:
                impact = predict_traffic_signal(road_density=2000, station_id=s)
                print(f"Station: {s:<10} -> AQI Change: {impact:.2%}")

if __name__ == "__main__":
    unittest.main(argv=['first-arg-is-ignored'], exit=False)
