"""
Traffic Service - Handles traffic congestion data.
Integrates with TomTom Traffic API (mocked for now).
"""
import random
from datetime import datetime


# Mock traffic data for Ahmedabad localities
MOCK_TRAFFIC_DATA = {
    'SG Highway': {'base_congestion': 75, 'peak_hours': ['08:00-10:00', '18:00-20:00']},
    'Vastrapur Lake': {'base_congestion': 60, 'peak_hours': ['09:00-11:00', '19:00-21:00']},
    'Maninagar': {'base_congestion': 82, 'peak_hours': ['07:00-09:00', '17:00-19:00']},
    'Kankaria': {'base_congestion': 70, 'peak_hours': ['10:00-12:00', '18:00-20:00']},
    'Bopal': {'base_congestion': 68, 'peak_hours': ['08:00-10:00', '18:00-20:00']},
    'default': {'base_congestion': 72, 'peak_hours': ['08:00-10:00', '18:00-20:00']}
}


def get_traffic_by_location(lat, lng, locality=None):
    """
    Get traffic congestion data for a specific location.
    
    In production, this would call TomTom Traffic Flow API:
    https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point={lat},{lng}&key={TOMTOM_API_KEY}
    
    Args:
        lat: Latitude
        lng: Longitude
        locality: Optional locality name
    
    Returns:
        dict: Traffic congestion data
    """
    if not locality:
        locality = 'default'
    
    traffic_base = MOCK_TRAFFIC_DATA.get(locality, MOCK_TRAFFIC_DATA['default'])
    congestion_index = traffic_base['base_congestion'] + random.randint(-5, 5)
    congestion_index = max(0, min(100, congestion_index))
    
    # Determine status based on congestion
    if congestion_index < 40:
        status = 'light'
    elif congestion_index < 70:
        status = 'moderate'
    elif congestion_index < 85:
        status = 'heavy'
    else:
        status = 'severe'
    
    return {
        'congestion_index': congestion_index,
        'status': status,
        'peak_hours': traffic_base['peak_hours'],
        'current_speed_kmh': max(20, 80 - (congestion_index * 0.6)),
        'free_flow_speed_kmh': 80,
        'last_updated': datetime.now().isoformat(),
        'data_source': 'Mocked TomTom Traffic Flow API'
    }
