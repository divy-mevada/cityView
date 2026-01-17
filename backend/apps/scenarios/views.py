"""
Scenario Management views for saving, listing, and comparing scenarios.
Government users only.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from middleware.role_permissions import IsGovernmentUser
from services.scenarios_service import (
    save_scenario,
    list_scenarios,
    compare_scenarios,
    get_scenario
)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsGovernmentUser])
def save(request):
    """
    Save a simulation scenario.
    
    Request body:
        {
            "name": "New Bridge at SG Highway",
            "description": "Building a bridge to reduce traffic",
            "simulation_data": {...},  // Result from simulation/run
            "tags": ["infrastructure", "traffic"]  // Optional
        }
    
    Response:
        {
            "scenario_id": "scenario_123",
            "name": "New Bridge at SG Highway",
            "saved_at": "2024-01-15T10:30:00Z"
        }
    """
    name = request.data.get('name')
    description = request.data.get('description', '')
    simulation_data = request.data.get('simulation_data')
    tags = request.data.get('tags', [])
    
    if not name or not simulation_data:
        return Response(
            {'error': 'Name and simulation_data are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    scenario = save_scenario(name, description, simulation_data, tags)
    
    return Response(scenario, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsGovernmentUser])
def list(request):
    """
    List all saved scenarios.
    
    Query params:
        - tag: Optional tag filter
        - limit: Optional limit (default: 50)
    
    Response:
        {
            "scenarios": [
                {
                    "id": "scenario_123",
                    "name": "...",
                    "description": "...",
                    "created_at": "...",
                    "tags": [...]
                },
                ...
            ],
            "total": 10
        }
    """
    tag = request.query_params.get('tag')
    limit = int(request.query_params.get('limit', 50))
    
    scenarios_data = list_scenarios(tag=tag, limit=limit)
    
    return Response(scenarios_data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsGovernmentUser])
def compare(request):
    """
    Compare two or more scenarios side-by-side.
    
    Request body:
        {
            "scenario_ids": ["scenario_123", "scenario_456"]
        }
    
    Response:
        {
            "scenarios": [...],
            "comparison": {
                "traffic": {...},
                "aqi": {...},
                ...
            }
        }
    """
    scenario_ids = request.data.get('scenario_ids', [])
    
    if not scenario_ids or len(scenario_ids) < 2:
        return Response(
            {'error': 'At least two scenario_ids are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    comparison = compare_scenarios(scenario_ids)
    
    return Response(comparison, status=status.HTTP_200_OK)
