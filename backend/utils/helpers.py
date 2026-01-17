"""
General utility functions for the platform.
"""
from datetime import datetime, timedelta
import random


def generate_trend_data(base_value, months, trend_type='stable', variance=10):
    """
    Generate trend data for forecasting.
    
    Args:
        base_value: Starting value
        months: Number of months to generate
        trend_type: 'stable', 'increasing', 'decreasing'
        variance: Random variance range
    
    Returns:
        list: List of dicts with 'period' and 'value' keys
    """
    data = []
    trend_factor = 0
    
    if trend_type == 'increasing':
        trend_factor = variance / months
    elif trend_type == 'decreasing':
        trend_factor = -variance / months
    
    for i in range(months):
        date = datetime.now() + timedelta(days=30 * i)
        value = base_value + (trend_factor * i) + random.uniform(-variance/2, variance/2)
        value = max(0, value)  # Ensure non-negative
        
        data.append({
            'period': date.strftime('%b %Y'),
            'value': round(value, 2)
        })
    
    return data


def get_severity_category(value, thresholds):
    """
    Get severity category based on value and thresholds.
    
    Args:
        value: Numeric value to categorize
        thresholds: Dict with 'good', 'moderate', 'unhealthy' thresholds
    
    Returns:
        str: 'good', 'moderate', 'unhealthy', 'severe'
    """
    if value <= thresholds.get('good', 50):
        return 'good'
    elif value <= thresholds.get('moderate', 100):
        return 'moderate'
    elif value <= thresholds.get('unhealthy', 150):
        return 'unhealthy'
    else:
        return 'severe'


def parse_what_if_query(query):
    """
    Parse natural language what-if query to extract action and location.
    
    Args:
        query: Natural language string like "What if a new bridge is built near SG Highway?"
    
    Returns:
        dict: {
            'action_type': 'bridge' | 'road' | 'hospital' | 'school',
            'location': 'SG Highway',
            'zone': 'West Zone',
            'ward': 'Vastrapur'
        }
    """
    query_lower = query.lower()
    
    # Extract action type
    action_type = None
    action_keywords = {
        'bridge': ['bridge', 'flyover'],
        'road': ['road', 'highway', 'street', 'avenue'],
        'hospital': ['hospital', 'medical', 'healthcare', 'clinic'],
        'school': ['school', 'education', 'college', 'university']
    }
    
    for action, keywords in action_keywords.items():
        if any(keyword in query_lower for keyword in keywords):
            action_type = action
            break
    
    if not action_type:
        action_type = 'infrastructure'  # Default
    
    # Extract location (simplified - in production, use NLP)
    location = 'Ahmedabad'  # Default
    ahmedabad_localities = ['SG Highway', 'Vastrapur', 'Bopal', 'Maninagar', 
                           'Kankaria', 'Satellite', 'Bodakdev']
    
    for locality in ahmedabad_localities:
        if locality.lower() in query_lower:
            location = locality
            break
    
    return {
        'action_type': action_type,
        'location': location,
        'zone': 'West Zone',  # Simplified mapping
        'ward': 'Vastrapur'
    }
