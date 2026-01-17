"""
Urban Development Service - Handles urban development project data.
"""
import random
from datetime import datetime


# Mock urban development data
MOCK_URBAN_DEV_DATA = {
    'Vastrapur': {
        'activity_score': 75,
        'ongoing_projects': [
            {'name': 'SG Highway Expansion', 'type': 'infrastructure', 'status': 'in_progress'},
            {'name': 'Metro Line Extension', 'type': 'transport', 'status': 'in_progress'},
        ],
        'planned_projects': [
            {'name': 'Smart City Hub', 'type': 'technology', 'status': 'planned'},
        ]
    },
    'Maninagar': {
        'activity_score': 62,
        'ongoing_projects': [
            {'name': 'Kankaria Lake Renovation', 'type': 'recreation', 'status': 'in_progress'},
        ],
        'planned_projects': [
            {'name': 'Waterfront Development', 'type': 'recreation', 'status': 'planned'},
        ]
    },
    'default': {
        'activity_score': 65,
        'ongoing_projects': [],
        'planned_projects': []
    }
}


def get_urban_dev_by_location(locality, ward):
    """
    Get urban development activity data for a location.
    
    Args:
        locality: Locality name
        ward: Ward name
    
    Returns:
        dict: Urban development activity and project data
    """
    urban_dev_data = MOCK_URBAN_DEV_DATA.get(ward, MOCK_URBAN_DEV_DATA['default'])
    
    return {
        'activity_score': urban_dev_data['activity_score'],
        'ongoing_projects': urban_dev_data['ongoing_projects'],
        'planned_projects': urban_dev_data['planned_projects'],
        'total_projects': len(urban_dev_data['ongoing_projects']) + len(urban_dev_data['planned_projects']),
        'last_updated': datetime.now().isoformat()
    }
