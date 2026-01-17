"""
Education Service - Handles school infrastructure and capacity data.
"""
import random
from datetime import datetime


# Mock education data for Ahmedabad wards
MOCK_EDUCATION_DATA = {
    'Vastrapur': {
        'schools': [
            {'name': 'Ahmedabad International School', 'capacity': 800, 'enrollment': 750, 'type': 'private'},
            {'name': 'Vastrapur Public School', 'capacity': 600, 'enrollment': 580, 'type': 'public'},
            {'name': 'SG Highway Primary School', 'capacity': 400, 'enrollment': 420, 'type': 'public'},
        ],
        'capacity_stress': 92
    },
    'Maninagar': {
        'schools': [
            {'name': 'Maninagar High School', 'capacity': 500, 'enrollment': 480, 'type': 'public'},
            {'name': 'Kankaria Secondary School', 'capacity': 450, 'enrollment': 470, 'type': 'public'},
        ],
        'capacity_stress': 88
    },
    'default': {
        'schools': [
            {'name': 'Local Public School', 'capacity': 400, 'enrollment': 380, 'type': 'public'},
        ],
        'capacity_stress': 85
    }
}


def get_education_by_location(locality, ward):
    """
    Get education infrastructure data for a location.
    
    Args:
        locality: Locality name
        ward: Ward name
    
    Returns:
        dict: Education capacity and enrollment data
    """
    education_data = MOCK_EDUCATION_DATA.get(ward, MOCK_EDUCATION_DATA['default'])
    
    total_capacity = sum(s['capacity'] for s in education_data['schools'])
    total_enrollment = sum(s['enrollment'] for s in education_data['schools'])
    enrollment_rate = total_enrollment / total_capacity if total_capacity > 0 else 0
    
    return {
        'schools': education_data['schools'],
        'capacity_stress': education_data['capacity_stress'],
        'enrollment_rate': round(enrollment_rate, 2),
        'total_capacity': total_capacity,
        'total_enrollment': total_enrollment,
        'overcrowded_schools': [s for s in education_data['schools'] if s['enrollment'] > s['capacity']],
        'last_updated': datetime.now().isoformat()
    }
