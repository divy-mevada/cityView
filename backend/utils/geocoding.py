"""
Utility functions for geocoding and location services.
Integrates with TomTom Reverse Geocoding API (mocked for now).
"""
import math
from django.conf import settings

# Ahmedabad zones, wards, and localities mapping (hardcoded)
AHMEDABAD_LOCATIONS = {
    'zones': {
        'West Zone': {
            'bounds': {'lat_min': 23.0000, 'lat_max': 23.0800, 'lng_min': 72.5000, 'lng_max': 72.6000},
            'wards': ['Vastrapur', 'Bodakdev', 'Satellite']
        },
        'East Zone': {
            'bounds': {'lat_min': 22.9500, 'lat_max': 23.0500, 'lng_min': 72.5500, 'lng_max': 72.6500},
            'wards': ['Maninagar', 'Nikol', 'Vastral']
        },
        'North Zone': {
            'bounds': {'lat_min': 23.0500, 'lat_max': 23.1500, 'lng_min': 72.5000, 'lng_max': 72.6000},
            'wards': ['Sabarmati', 'Chandkheda', 'Motera']
        },
        'South Zone': {
            'bounds': {'lat_min': 22.9000, 'lat_max': 23.0000, 'lng_min': 72.5000, 'lng_max': 72.6500},
            'wards': ['Sarkhej', 'Juhapura', 'Bopal']
        }
    },
    'wards': {
        'Vastrapur': {
            'center': {'lat': 23.0300, 'lng': 72.5200},
            'localities': ['SG Highway', 'Vastrapur Lake', 'Shilaj']
        },
        'Maninagar': {
            'center': {'lat': 23.0000, 'lng': 72.6000},
            'localities': ['Kankaria', 'Maninagar Station', 'Danilimda']
        },
        'Bodakdev': {
            'center': {'lat': 23.0500, 'lng': 72.5300},
            'localities': ['Prahladnagar', 'Sola', 'Science City']
        },
        'Satellite': {
            'center': {'lat': 23.0600, 'lng': 72.5100},
            'localities': ['Satellite Road', 'Navrangpura', 'CG Road']
        }
    }
}


def reverse_geocode_tomtom(lat, lng):
    """
    Reverse geocode coordinates using TomTom API (mocked).
    
    In production, this would call:
    https://api.tomtom.com/search/2/reverseGeocode/{lat},{lng}.json?key={TOMTOM_API_KEY}
    
    Args:
        lat: Latitude
        lng: Longitude
    
    Returns:
        dict: {
            'locality': 'SG Highway',
            'ward': 'Vastrapur',
            'zone': 'West Zone',
            'address': 'SG Highway, Vastrapur, Ahmedabad'
        }
    """
    # Validate Ahmedabad bounds
    if not (22.8000 <= lat <= 23.2000 and 72.4000 <= lng <= 72.7000):
        return {
            'locality': 'Unknown',
            'ward': 'Unknown',
            'zone': 'Unknown',
            'address': 'Location outside Ahmedabad city limits'
        }
    
    # Find nearest zone and ward based on coordinates
    nearest_zone = None
    nearest_ward = None
    nearest_locality = None
    min_distance = float('inf')
    
    for zone_name, zone_data in AHMEDABAD_LOCATIONS['zones'].items():
        bounds = zone_data['bounds']
        if (bounds['lat_min'] <= lat <= bounds['lat_max'] and 
            bounds['lng_min'] <= lng <= bounds['lng_max']):
            nearest_zone = zone_name
            
            # Find nearest ward
            for ward_name in zone_data['wards']:
                if ward_name in AHMEDABAD_LOCATIONS['wards']:
                    ward_center = AHMEDABAD_LOCATIONS['wards'][ward_name]['center']
                    distance = math.sqrt(
                        (lat - ward_center['lat'])**2 + 
                        (lng - ward_center['lng'])**2
                    )
                    if distance < min_distance:
                        min_distance = distance
                        nearest_ward = ward_name
                        # Get first locality as default
                        localities = AHMEDABAD_LOCATIONS['wards'][ward_name]['localities']
                        nearest_locality = localities[0] if localities else 'Unknown'
            break
    
    if not nearest_zone:
        # Default to city center area
        nearest_zone = 'West Zone'
        nearest_ward = 'Vastrapur'
        nearest_locality = 'SG Highway'
    
    return {
        'locality': nearest_locality,
        'ward': nearest_ward,
        'zone': nearest_zone,
        'address': f'{nearest_locality}, {nearest_ward}, Ahmedabad'
    }


def get_distance(lat1, lng1, lat2, lng2):
    """
    Calculate distance between two coordinates using Haversine formula.
    
    Returns distance in kilometers.
    """
    R = 6371  # Earth radius in km
    
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c
