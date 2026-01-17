"""
AQI Service - Handles air quality data retrieval using AQICN API.
"""
import requests
import random
from datetime import datetime, timedelta
from django.conf import settings
from utils.helpers import get_severity_category


# Fallback mock data for when API is unavailable
MOCK_AQI_DATA = {
    'SG Highway': {'base': 145, 'pm25': 60, 'pm10': 115, 'no2': 42},
    'Vastrapur Lake': {'base': 132, 'pm25': 55, 'pm10': 105, 'no2': 38},
    'Maninagar': {'base': 178, 'pm25': 75, 'pm10': 140, 'no2': 55},
    'Kankaria': {'base': 165, 'pm25': 68, 'pm10': 128, 'no2': 48},
    'Bopal': {'base': 152, 'pm25': 63, 'pm10': 122, 'no2': 45},
    'default': {'base': 156, 'pm25': 64, 'pm10': 120, 'no2': 44}
}

AQI_THRESHOLDS = {
    'good': 50,
    'moderate': 100,
    'unhealthy': 150,
    'severe': 200
}


def get_aqicn_data(lat, lng):
    """
    Fetch AQI data from AQICN API.
    
    Args:
        lat: Latitude
        lng: Longitude
    
    Returns:
        dict: AQICN API response data
    """
    try:
        api_key = getattr(settings, 'AQICN_API_KEY', 'demo')
        base_url = getattr(settings, 'AQICN_API_BASE_URL', 'https://api.waqi.info')
        
        url = f"{base_url}/feed/geo:{lat};{lng}/?token={api_key}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            return response.json()
        else:
            return None
    except Exception as e:
        print(f"Error fetching AQICN data: {e}")
        return None


def get_current_aqi(zone=None, ward=None):
    """
    Get current city-wide AQI data using AQICN API.
    
    Args:
        zone: Optional zone filter
        ward: Optional ward filter
    
    Returns:
        dict: City-wide AQI data with zone breakdown
    """
    # Ahmedabad zone coordinates
    zone_coords = {
        'West Zone': (23.0368, 72.5066),
        'East Zone': (23.0088, 72.6283),
        'North Zone': (23.0693, 72.5493),
        'South Zone': (22.9734, 72.4606)
    }
    
    zones_data = []
    city_total = 0
    
    for zone_name, (lat, lng) in zone_coords.items():
        if zone and zone_name != zone:
            continue
            
        aqicn_data = get_aqicn_data(lat, lng)
        
        if aqicn_data and aqicn_data.get('status') == 'ok':
            aqi_val = aqicn_data['data']['aqi']
        else:
            # Fallback to mock data
            aqi_val = MOCK_AQI_DATA['default']['base'] + random.randint(-10, 10)
        
        zones_data.append({
            'zone': zone_name,
            'aqi': aqi_val,
            'category': get_severity_category(aqi_val, AQI_THRESHOLDS)
        })
        city_total += aqi_val
    
    city_avg = city_total // len(zones_data) if zones_data else 156
    
    return {
        'city_average': city_avg,
        'category': get_severity_category(city_avg, AQI_THRESHOLDS),
        'zones': zones_data,
        'timestamp': datetime.now().isoformat(),
        'data_source': 'AQICN API with fallback to mock data'
    }


def get_aqi_by_location(lat, lng, locality=None):
    """
    Get AQI data for a specific location using AQICN API.
    
    Args:
        lat: Latitude
        lng: Longitude
        locality: Optional locality name
    
    Returns:
        dict: Location-specific AQI data
    """
    # Try to get data from AQICN API
    aqicn_data = get_aqicn_data(lat, lng)
    
    if aqicn_data and aqicn_data.get('status') == 'ok':
        data = aqicn_data['data']
        aqi_value = data['aqi']
        
        # Extract pollutant data
        iaqi = data.get('iaqi', {})
        pm25 = iaqi.get('pm25', {}).get('v', 0)
        pm10 = iaqi.get('pm10', {}).get('v', 0)
        no2 = iaqi.get('no2', {}).get('v', 0)
        
        station_name = data.get('city', {}).get('name', 'Unknown Station')
        
        return {
            'locality': locality or station_name,
            'ward': 'Auto-detected',
            'aqi': {
                'value': aqi_value,
                'category': get_severity_category(aqi_value, AQI_THRESHOLDS),
                'pm25': pm25,
                'pm10': pm10,
                'no2': no2,
                'trend': 'stable',
                'last_updated': data.get('time', {}).get('s', datetime.now().isoformat())
            },
            'nearest_station': {
                'name': station_name,
                'distance_km': 0.0
            },
            'explanation': 'Real-time AQI data from AQICN monitoring network'
        }
    else:
        # Fallback to mock data
        if not locality:
            if 23.0200 <= lat <= 23.0400 and 72.5100 <= lng <= 72.5300:
                locality = 'SG Highway'
            elif 22.9900 <= lat <= 23.0100 and 72.5900 <= lng <= 72.6100:
                locality = 'Maninagar'
            else:
                locality = 'default'
        
        aqi_base = MOCK_AQI_DATA.get(locality, MOCK_AQI_DATA['default'])
        aqi_value = aqi_base['base'] + random.randint(-5, 5)
        aqi_value = max(0, min(300, aqi_value))
        
        return {
            'locality': locality,
            'ward': 'Vastrapur' if 'Vastrapur' in locality or 'SG Highway' in locality else 'Maninagar',
            'aqi': {
                'value': aqi_value,
                'category': get_severity_category(aqi_value, AQI_THRESHOLDS),
                'pm25': aqi_base['pm25'] + random.randint(-2, 2),
                'pm10': aqi_base['pm10'] + random.randint(-3, 3),
                'no2': aqi_base['no2'] + random.randint(-2, 2),
                'trend': 'stable',
                'last_updated': datetime.now().isoformat()
            },
            'nearest_station': {
                'name': f'{locality} AQI Station',
                'distance_km': round(random.uniform(1.0, 5.0), 1)
            },
            'explanation': 'Fallback mock data (AQICN API unavailable)'
        }


def get_aqi_trend(locality, months=6):
    """
    Get AQI trend data for a locality over time.
    
    Args:
        locality: Locality name
        months: Number of months of historical data
    
    Returns:
        list: List of dicts with period and value
    """
    base_aqi = MOCK_AQI_DATA.get(locality, MOCK_AQI_DATA['default'])['base']
    
    trend_data = []
    for i in range(months):
        month_date = datetime.now().replace(day=1) - timedelta(days=30 * i)
        value = base_aqi + random.randint(-10, 10) + (i * 0.5)
        value = max(50, min(250, value))
        
        trend_data.insert(0, {
            'period': month_date.strftime('%b %Y'),
            'value': round(value, 1)
        })
    
    return trend_data
