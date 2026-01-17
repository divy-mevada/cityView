"""
Healthcare Service - Handles healthcare capacity and facility data.
"""
import random
from datetime import datetime


# Mock healthcare data for Ahmedabad wards
MOCK_HEALTHCARE_DATA = {
    'Vastrapur': {
        'hospitals': [
            {'name': 'Apollo Hospital', 'beds': 350, 'utilization': 82, 'type': 'private'},
            {'name': 'Civil Hospital Annex', 'beds': 200, 'utilization': 75, 'type': 'public'},
        ],
        'capacity_utilization': 78
    },
    'Maninagar': {
        'hospitals': [
            {'name': 'Shalby Hospital', 'beds': 300, 'utilization': 88, 'type': 'private'},
            {'name': 'Kankaria General Hospital', 'beds': 150, 'utilization': 92, 'type': 'public'},
        ],
        'capacity_utilization': 85
    },
    'default': {
        'hospitals': [
            {'name': 'General Hospital', 'beds': 250, 'utilization': 80, 'type': 'public'},
        ],
        'capacity_utilization': 80
    }
}


def get_healthcare_by_location(locality, ward):
    """
    Get healthcare capacity data for a location.
    
    Args:
        locality: Locality name
        ward: Ward name
    
    Returns:
        dict: Healthcare capacity and facility data
    """
    healthcare_data = MOCK_HEALTHCARE_DATA.get(ward, MOCK_HEALTHCARE_DATA['default'])
    
    # Add nearest facilities (simplified)
    nearest_facilities = [
        {
            'name': hospital['name'],
            'distance_km': round(random.uniform(1.0, 8.0), 1),
            'beds_available': hospital['beds'] - int(hospital['beds'] * hospital['utilization'] / 100),
            'utilization_percent': hospital['utilization']
        }
        for hospital in healthcare_data['hospitals']
    ]
    
    return {
        'hospitals': healthcare_data['hospitals'],
        'capacity_utilization': healthcare_data['capacity_utilization'],
        'nearest_facilities': nearest_facilities,
        'total_beds': sum(h['beds'] for h in healthcare_data['hospitals']),
        'available_beds': sum(h['beds'] - int(h['beds'] * h['utilization'] / 100) 
                             for h in healthcare_data['hospitals']),
        'last_updated': datetime.now().isoformat()
    }
