"""
What-If Simulation views for government users only.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from middleware.role_permissions import IsGovernmentUser
from services.simulation_service import run_what_if_simulation, explain_simulation


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsGovernmentUser])
def run(request):
    """
    Run a what-if simulation based on natural language input.
    
    Request body:
        {
            "query": "What if a new bridge is built near SG Highway?",
            "timeline": "6months"  // Optional: "1month", "3months", "6months"
        }
    
    Response:
        {
            "scenario": {
                "action_type": "bridge",
                "location": "SG Highway",
                "zone": "West Zone",
                "ward": "Vastrapur"
            },
            "impacts": {
                "traffic": {...},
                "aqi": {...},
                "healthcare": {...},
                "education": {...},
                "urban_development": {...}
            },
            "timeline": "6months",
            "summary": "..."
        }
    """
    query = request.data.get('query')
    timeline = request.data.get('timeline', '6months')
    
    if not query:
        return Response(
            {'error': 'Query is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate timeline
    valid_timelines = ['1month', '3months', '6months']
    if timeline not in valid_timelines:
        return Response(
            {'error': f'Invalid timeline. Must be one of: {", ".join(valid_timelines)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    simulation_result = run_what_if_simulation(query, timeline)
    
    return Response(simulation_result, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsGovernmentUser])
def explain(request):
    """
    Get detailed explanation of simulation results.
    
    Request body:
        {
            "simulation_id": "sim_123",  // Optional
            "action_type": "bridge",
            "location": "SG Highway"
        }
    
    Response:
        {
            "explanation": "...",
            "methodology": "...",
            "assumptions": [...],
            "confidence_score": 0.85
        }
    """
    simulation_id = request.data.get('simulation_id')
    action_type = request.data.get('action_type')
    location = request.data.get('location')
    
    explanation = explain_simulation(action_type, location, simulation_id)
    
    return Response(explanation, status=status.HTTP_200_OK)
