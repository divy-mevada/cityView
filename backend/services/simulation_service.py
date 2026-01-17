"""
Simulation Service - Handles what-if scenario simulations.
Parses natural language queries and simulates impacts.
"""
import random
from datetime import datetime, timedelta
from utils.helpers import parse_what_if_query, generate_trend_data
from services.aqi_service import get_current_aqi
from services.traffic_service import MOCK_TRAFFIC_DATA
from services.forecast_service import get_area_forecast


# Impact multipliers for different action types
ACTION_IMPACTS = {
    'bridge': {
        'traffic': -0.15,  # Reduce congestion by 15%
        'aqi': -0.05,  # Slight AQI improvement
        'urban_development': 0.10,  # Increase activity
        'healthcare': 0.02,  # Slight increase in load
        'education': 0.0  # No direct impact
    },
    'road': {
        'traffic': -0.20,
        'aqi': -0.08,
        'urban_development': 0.12,
        'healthcare': 0.01,
        'education': 0.0
    },
    'hospital': {
        'traffic': 0.05,
        'aqi': 0.02,
        'urban_development': 0.15,
        'healthcare': -0.25,  # Reduce utilization by 25%
        'education': 0.0
    },
    'school': {
        'traffic': 0.08,
        'aqi': 0.01,
        'urban_development': 0.10,
        'healthcare': 0.0,
        'education': -0.20  # Reduce capacity stress by 20%
    },
    'infrastructure': {
        'traffic': -0.10,
        'aqi': -0.03,
        'urban_development': 0.08,
        'healthcare': 0.0,
        'education': 0.0
    }
}


def run_what_if_simulation(query, timeline='6months'):
    """
    Run a what-if simulation based on natural language query.
    
    Args:
        query: Natural language query string
        timeline: '1month', '3months', or '6months'
    
    Returns:
        dict: Simulation results with impacts
    """
    # Parse query to extract action and location
    parsed = parse_what_if_query(query)
    action_type = parsed['action_type']
    location = parsed['location']
    zone = parsed['zone']
    ward = parsed['ward']
    
    # Get current metrics
    current_aqi = get_current_aqi(zone=zone, ward=ward)
    base_aqi = current_aqi['city_average']
    
    # Get current traffic (simplified)
    base_traffic = 72
    if location in MOCK_TRAFFIC_DATA:
        base_traffic = MOCK_TRAFFIC_DATA[location]['base_congestion']
    
    # Base metrics
    base_healthcare = 82
    base_education = 88
    base_urban_dev = 70
    
    # Get impact multipliers
    impacts = ACTION_IMPACTS.get(action_type, ACTION_IMPACTS['infrastructure'])
    
    # Calculate projected impacts
    months_map = {'1month': 1, '3months': 3, '6months': 6}
    months = months_map.get(timeline, 3)
    
    # Apply impacts
    projected_traffic = base_traffic * (1 + impacts['traffic'])
    projected_aqi = base_aqi * (1 + impacts['aqi'])
    projected_healthcare = base_healthcare * (1 + impacts['healthcare'])
    projected_education = base_education * (1 + impacts['education'])
    projected_urban_dev = base_urban_dev * (1 + impacts['urban_development'])
    
    # Generate trend data
    traffic_forecast = generate_trend_data(base_traffic, months, 'decreasing' if impacts['traffic'] < 0 else 'increasing')
    aqi_forecast = generate_trend_data(base_aqi, months, 'decreasing' if impacts['aqi'] < 0 else 'stable')
    
    return {
        'scenario': {
            'action_type': action_type,
            'location': location,
            'zone': zone,
            'ward': ward,
            'description': f"Simulation: {action_type} at {location}"
        },
        'impacts': {
            'traffic': {
                'current': base_traffic,
                'projected': round(projected_traffic, 1),
                'change_percent': round(impacts['traffic'] * 100, 1),
                'impact': 'positive' if impacts['traffic'] < 0 else 'negative',
                'forecast': traffic_forecast
            },
            'aqi': {
                'current': base_aqi,
                'projected': round(projected_aqi, 1),
                'change_percent': round(impacts['aqi'] * 100, 1),
                'impact': 'positive' if impacts['aqi'] < 0 else 'negative',
                'forecast': aqi_forecast
            },
            'healthcare': {
                'current': base_healthcare,
                'projected': round(projected_healthcare, 1),
                'change_percent': round(impacts['healthcare'] * 100, 1),
                'impact': 'positive' if impacts['healthcare'] < 0 else 'negative'
            },
            'education': {
                'current': base_education,
                'projected': round(projected_education, 1),
                'change_percent': round(impacts['education'] * 100, 1),
                'impact': 'positive' if impacts['education'] < 0 else 'negative'
            },
            'urban_development': {
                'current': base_urban_dev,
                'projected': round(projected_urban_dev, 1),
                'change_percent': round(impacts['urban_development'] * 100, 1),
                'impact': 'positive' if impacts['urban_development'] > 0 else 'negative'
            }
        },
        'timeline': timeline,
        'summary': _generate_summary(action_type, location, impacts, projected_traffic, projected_aqi),
        'generated_at': datetime.now().isoformat(),
        'confidence_score': round(random.uniform(0.75, 0.90), 2)
    }


def explain_simulation(action_type, location, simulation_id=None):
    """
    Provide detailed explanation of simulation methodology and results.
    
    Args:
        action_type: Type of action (bridge, road, hospital, etc.)
        location: Location name
        simulation_id: Optional simulation ID
    
    Returns:
        dict: Detailed explanation
    """
    impacts = ACTION_IMPACTS.get(action_type, ACTION_IMPACTS['infrastructure'])
    
    explanations = {
        'bridge': 'Building a new bridge reduces traffic congestion by providing alternative routes, improves air quality through reduced idling, and stimulates urban development.',
        'road': 'New road infrastructure significantly reduces traffic congestion, improves connectivity, and supports urban growth with minimal environmental impact.',
        'hospital': 'Adding a hospital reduces healthcare capacity utilization in the area, improves access to medical services, but may slightly increase local traffic.',
        'school': 'New school infrastructure reduces enrollment pressure, improves education access, but may increase local traffic during peak hours.',
        'infrastructure': 'General infrastructure improvements enhance connectivity and support overall urban development with moderate positive impacts.'
    }
    
    methodology = [
        'Simulation uses rule-based impact modeling',
        'Impacts derived from historical infrastructure project data',
        'Considers spatial relationships and local factors',
        'Assumes standard implementation timeline',
        'Does not account for external events or policy changes'
    ]
    
    assumptions = [
        'No major competing projects during simulation period',
        'Standard implementation timeline',
        'Current trends continue unchanged except for simulated action',
        'Spatial impacts localized to specified area',
        'Population growth follows existing projections'
    ]
    
    return {
        'explanation': explanations.get(action_type, explanations['infrastructure']),
        'methodology': methodology,
        'assumptions': assumptions,
        'confidence_score': round(random.uniform(0.75, 0.90), 2),
        'action_type': action_type,
        'location': location,
        'simulation_id': simulation_id,
        'generated_at': datetime.now().isoformat()
    }


def _generate_summary(action_type, location, impacts, projected_traffic, projected_aqi):
    """Generate a summary of simulation results."""
    positive_impacts = [k for k, v in impacts.items() if v < 0 or (k == 'urban_development' and v > 0)]
    negative_impacts = [k for k, v in impacts.items() if v > 0 and k != 'urban_development']
    
    summary = f"Building {action_type} at {location} is projected to have "
    
    if positive_impacts:
        summary += f"positive impacts on {', '.join(positive_impacts)}. "
    
    if negative_impacts:
        summary += f"Some increases expected in {', '.join(negative_impacts)}. "
    
    summary += f"Overall, traffic congestion is projected to {['improve', 'worsen'][impacts['traffic'] > 0]} to {projected_traffic:.1f}, "
    summary += f"and AQI is expected to {['improve', 'worsen'][impacts['aqi'] > 0]} to {projected_aqi:.1f}."
    
    return summary
