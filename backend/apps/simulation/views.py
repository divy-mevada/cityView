"""
What-If Simulation views for government users only.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
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


import requests
import json
import os
from datetime import datetime

@api_view(['POST'])
@permission_classes([AllowAny])
def predict(request):
    """
    Proxy and persist predict data requests.
    Uses basic prediction (run_model.py) if no scenario provided, otherwise uses full scenario analysis.
    """
    try:
        # 1. Prepare data for AI Server
        ai_server_url = os.environ.get('AI_SERVER_URL', 'http://localhost:8001')
        
        # Check if this is a basic prediction request (no scenario or simple scenario)
        scenario = request.data.get('scenario', '')
        is_basic_prediction = (
            not scenario or 
            scenario.lower().strip() in ['', 'basic prediction', 'generate prediction', 'generate city-wide prediction'] or
            'without' in scenario.lower() or
            'basic' in scenario.lower()
        )
        
        # 2. Forward to FastAPI - use basic-predict for simple requests
        endpoint = "/api/basic-predict" if is_basic_prediction else "/predict"
        
        # For basic prediction, only send lat/lon
        if is_basic_prediction:
            payload = {
                "lat": request.data.get('lat'),
                "lon": request.data.get('lon')
            }
        else:
            payload = request.data
        
        response = requests.post(
            f"{ai_server_url}{endpoint}",
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=60
        )
        
        if response.status_code != 200:
            # Try to parse error message from response
            error_message = f'AI Server error (status {response.status_code})'
            try:
                error_data = response.json()
                if 'detail' in error_data:
                    error_message = error_data['detail']
                elif 'error' in error_data:
                    error_message = error_data['error']
                else:
                    error_message = response.text[:200]  # Limit error text length
            except:
                error_message = response.text[:200] if response.text else error_message
            
            return Response(
                {'error': error_message},
                status=response.status_code
            )
            
        data = response.json()
        
        # 3. Store the result in ai_responses_storage (JSON persistence)
        storage_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'ai_responses_storage')
        if not os.path.exists(storage_dir):
            os.makedirs(storage_dir)
            
        timestamp = int(datetime.now().timestamp())
        # Handle anonymous users (AllowAny permission)
        username = 'anonymous'
        if hasattr(request, 'user') and hasattr(request.user, 'is_authenticated') and request.user.is_authenticated:
            username = getattr(request.user, 'username', 'user')
        elif hasattr(request, 'user'):
            username = str(request.user)
        file_name = f"predict_{timestamp}_{username}.json"
        file_path = os.path.join(storage_dir, file_name)
        
        storage_data = {
            "request": request.data,
            "response": data,
            "user": username,
            "timestamp": datetime.now().isoformat()
        }
        
        with open(file_path, 'w') as f:
            json.dump(storage_data, f, indent=2)
            
        return Response(data, status=status.HTTP_200_OK)
        
    except requests.exceptions.ConnectionError as e:
        return Response(
            {
                'error': f'AI server (FastAPI) is not running on {ai_server_url}. Please start the AI server using: cd ai && python api_server.py'
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    except requests.exceptions.Timeout:
        return Response(
            {'error': 'AI server request timed out. The prediction may be taking too long.'},
            status=status.HTTP_504_GATEWAY_TIMEOUT
        )
    except Exception as e:
        import traceback
        error_details = str(e)
        # Log full traceback for debugging
        print(f"Prediction error: {traceback.format_exc()}")
        return Response(
            {'error': f'Internal server error: {error_details}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
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
