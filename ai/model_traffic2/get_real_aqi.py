
import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from ai.model_ai1.config import OPENWEATHER_API_KEY
from ai.model_ai1.fetch_current_api import fetch_current_aqi

def get_real_aqi():
    lat = 23.1175
    lon = 72.5767
    
    print(f"Fetching Real-Time AQI for: {lat}, {lon}")
    
    try:
        aqi = fetch_current_aqi(lat, lon, OPENWEATHER_API_KEY)
        print(f"Real-Time AQI: {aqi}")
    except Exception as e:
        print(f"Error fetching AQI: {e}")

if __name__ == "__main__":
    get_real_aqi()
