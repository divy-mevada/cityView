"""
Demand Service - Estimates daily footfall and demand based on various factors.
"""
import random
from datetime import datetime


# Default values for Ahmedabad
DEFAULT_POPULATION_DENSITY = 8500  # per sq km
DEFAULT_TRAFFIC_INFLOW = 1200  # vehicles/hour
DEFAULT_INFRASTRUCTURE_DENSITY = 0.75


def estimate_demand(zone=None, ward=None, locality=None, 
                    population_density=None, traffic_inflow=None, 
                    infrastructure_density=None):
    """
    Estimate daily footfall and demand index for an area.
    
    Args:
        zone: Optional zone name
        ward: Optional ward name
        locality: Optional locality name
        population_density: Optional population density (per sq km)
        traffic_inflow: Optional traffic inflow (vehicles/hour)
        infrastructure_density: Optional infrastructure density (0-1)
    
    Returns:
        dict: Demand and footfall estimation
    """
    # Use defaults if not provided
    pop_density = population_density or DEFAULT_POPULATION_DENSITY
    traffic = traffic_inflow or DEFAULT_TRAFFIC_INFLOW
    infra_density = infrastructure_density or DEFAULT_INFRASTRUCTURE_DENSITY
    
    # Adjust based on locality (simplified)
    locality_multipliers = {
        'SG Highway': 1.3,  # High footfall area
        'Maninagar': 1.1,
        'Kankaria': 1.2,
        'Vastrapur Lake': 0.9,
        'Bopal': 1.0
    }
    multiplier = locality_multipliers.get(locality, 1.0) if locality else 1.0
    
    # Calculate daily footfall
    # Formula: base_footfall * (pop_density / 1000) * traffic_factor * infra_factor * locality_multiplier
    base_footfall = 500
    pop_factor = pop_density / 1000
    traffic_factor = traffic / 1000
    infra_factor = infra_density * 1.2
    
    daily_footfall = int(base_footfall * pop_factor * traffic_factor * infra_factor * multiplier)
    daily_footfall = max(200, min(5000, daily_footfall))  # Clamp to reasonable range
    
    # Calculate peak hour demand (typically 20-25% of daily footfall)
    peak_hour_demand = int(daily_footfall * 0.22)
    
    # Determine demand index
    if daily_footfall >= 2000:
        demand_index = 'High'
    elif daily_footfall >= 1000:
        demand_index = 'Medium'
    else:
        demand_index = 'Low'
    
    return {
        'daily_footfall': daily_footfall,
        'peak_hour_demand': peak_hour_demand,
        'demand_index': demand_index,
        'factors': {
            'population_density': pop_density,
            'traffic_inflow': traffic,
            'infrastructure_density': round(infra_density, 2),
            'locality_multiplier': multiplier
        },
        'area': {
            'zone': zone,
            'ward': ward,
            'locality': locality
        },
        'recommendations': _get_recommendations(demand_index, daily_footfall),
        'estimated_at': datetime.now().isoformat()
    }


def _get_recommendations(demand_index, footfall):
    """Get recommendations based on demand index."""
    if demand_index == 'High':
        return [
            'Consider expanding public transport connectivity',
            'Monitor peak hour traffic management',
            'Evaluate need for additional infrastructure',
            'Review parking capacity requirements'
        ]
    elif demand_index == 'Medium':
        return [
            'Maintain current infrastructure levels',
            'Plan for future growth scenarios',
            'Monitor demand trends regularly'
        ]
    else:
        return [
            'Current infrastructure sufficient',
            'Focus on improving connectivity',
            'Monitor for growth opportunities'
        ]
