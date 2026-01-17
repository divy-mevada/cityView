"""
Scenarios Service - Handles saving, retrieving, and comparing simulation scenarios.
Uses in-memory storage (to be replaced with PostgreSQL later).
"""
import uuid
from datetime import datetime
from typing import List, Dict, Optional


# In-memory scenario storage (replace with PostgreSQL later)
SCENARIOS_STORAGE: Dict[str, Dict] = {}


def save_scenario(name: str, description: str, simulation_data: Dict, tags: List[str] = None) -> Dict:
    """
    Save a simulation scenario.
    
    Args:
        name: Scenario name
        description: Scenario description
        simulation_data: Full simulation result data
        tags: Optional list of tags
    
    Returns:
        dict: Saved scenario data
    """
    scenario_id = f"scenario_{uuid.uuid4().hex[:12]}"
    
    scenario = {
        'id': scenario_id,
        'name': name,
        'description': description,
        'simulation_data': simulation_data,
        'tags': tags or [],
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    }
    
    SCENARIOS_STORAGE[scenario_id] = scenario
    
    return {
        'scenario_id': scenario_id,
        'name': name,
        'description': description,
        'saved_at': scenario['created_at']
    }


def list_scenarios(tag: Optional[str] = None, limit: int = 50) -> Dict:
    """
    List all saved scenarios with optional filtering.
    
    Args:
        tag: Optional tag to filter by
        limit: Maximum number of scenarios to return
    
    Returns:
        dict: List of scenarios with metadata
    """
    scenarios = list(SCENARIOS_STORAGE.values())
    
    # Filter by tag if provided
    if tag:
        scenarios = [s for s in scenarios if tag in s.get('tags', [])]
    
    # Sort by created_at (newest first)
    scenarios.sort(key=lambda x: x['created_at'], reverse=True)
    
    # Limit results
    scenarios = scenarios[:limit]
    
    # Prepare response (exclude full simulation_data)
    scenarios_list = [
        {
            'id': s['id'],
            'name': s['name'],
            'description': s['description'],
            'created_at': s['created_at'],
            'tags': s['tags'],
            'action_type': s['simulation_data'].get('scenario', {}).get('action_type'),
            'location': s['simulation_data'].get('scenario', {}).get('location')
        }
        for s in scenarios
    ]
    
    return {
        'scenarios': scenarios_list,
        'total': len(scenarios_list)
    }


def get_scenario(scenario_id: str) -> Optional[Dict]:
    """
    Get a specific scenario by ID.
    
    Args:
        scenario_id: Scenario ID
    
    Returns:
        dict: Full scenario data or None if not found
    """
    return SCENARIOS_STORAGE.get(scenario_id)


def compare_scenarios(scenario_ids: List[str]) -> Dict:
    """
    Compare multiple scenarios side-by-side.
    
    Args:
        scenario_ids: List of scenario IDs to compare
    
    Returns:
        dict: Comparison data
    """
    scenarios = [get_scenario(sid) for sid in scenario_ids if get_scenario(sid)]
    
    if len(scenarios) < 2:
        return {'error': 'Not enough valid scenarios to compare'}
    
    # Extract impact data from each scenario
    comparisons = {}
    
    # Compare traffic impacts
    traffic_data = []
    aqi_data = []
    healthcare_data = []
    education_data = []
    urban_dev_data = []
    
    for scenario in scenarios:
        impacts = scenario['simulation_data'].get('impacts', {})
        
        traffic_data.append({
            'scenario_id': scenario['id'],
            'scenario_name': scenario['name'],
            'current': impacts.get('traffic', {}).get('current'),
            'projected': impacts.get('traffic', {}).get('projected'),
            'change_percent': impacts.get('traffic', {}).get('change_percent')
        })
        
        aqi_data.append({
            'scenario_id': scenario['id'],
            'scenario_name': scenario['name'],
            'current': impacts.get('aqi', {}).get('current'),
            'projected': impacts.get('aqi', {}).get('projected'),
            'change_percent': impacts.get('aqi', {}).get('change_percent')
        })
        
        healthcare_data.append({
            'scenario_id': scenario['id'],
            'scenario_name': scenario['name'],
            'current': impacts.get('healthcare', {}).get('current'),
            'projected': impacts.get('healthcare', {}).get('projected'),
            'change_percent': impacts.get('healthcare', {}).get('change_percent')
        })
        
        education_data.append({
            'scenario_id': scenario['id'],
            'scenario_name': scenario['name'],
            'current': impacts.get('education', {}).get('current'),
            'projected': impacts.get('education', {}).get('projected'),
            'change_percent': impacts.get('education', {}).get('change_percent')
        })
        
        urban_dev_data.append({
            'scenario_id': scenario['id'],
            'scenario_name': scenario['name'],
            'current': impacts.get('urban_development', {}).get('current'),
            'projected': impacts.get('urban_development', {}).get('projected'),
            'change_percent': impacts.get('urban_development', {}).get('change_percent')
        })
    
    return {
        'scenarios': [
            {
                'id': s['id'],
                'name': s['name'],
                'description': s['description'],
                'created_at': s['created_at']
            }
            for s in scenarios
        ],
        'comparison': {
            'traffic': traffic_data,
            'aqi': aqi_data,
            'healthcare': healthcare_data,
            'education': education_data,
            'urban_development': urban_dev_data
        },
        'compared_at': datetime.now().isoformat()
    }
