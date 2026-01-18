"""
AI Response storage and retrieval views.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import json
import os
from datetime import datetime

# Simple file-based storage for AI responses
RESPONSES_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'ai_responses_storage')

def ensure_storage_dir():
    if not os.path.exists(RESPONSES_DIR):
        os.makedirs(RESPONSES_DIR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def store_ai_response(request):
    """
    Store AI model response for sharing.
    
    Request body:
        {
            "scenario": "What if we reduce traffic by 20%?",
            "location": {"lat": 23.0225, "lng": 72.5714},
            "response": {...},
            "user_id": "user123"
        }
    """
    ensure_storage_dir()
    
    scenario = request.data.get('scenario')
    location = request.data.get('location')
    ai_response = request.data.get('response')
    user_id = request.data.get('user_id', 'anonymous')
    
    if not scenario or not ai_response:
        return Response(
            {'error': 'Scenario and response are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create response record
    response_id = f"ai_{int(datetime.now().timestamp())}"
    response_data = {
        'id': response_id,
        'scenario': scenario,
        'location': location,
        'response': ai_response,
        'user_id': user_id,
        'created_at': datetime.now().isoformat(),
        'shared': True
    }
    
    # Save to file
    file_path = os.path.join(RESPONSES_DIR, f"{response_id}.json")
    with open(file_path, 'w') as f:
        json.dump(response_data, f, indent=2)
    
    return Response({
        'response_id': response_id,
        'message': 'AI response stored successfully'
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_ai_responses(request):
    """
    Get stored AI responses.
    
    Query params:
        - limit: Number of responses to return (default: 10)
        - user_id: Filter by user (optional)
    """
    ensure_storage_dir()
    
    limit = int(request.query_params.get('limit', 10))
    user_filter = request.query_params.get('user_id')
    
    responses = []
    
    # Read all response files
    for filename in os.listdir(RESPONSES_DIR):
        if filename.endswith('.json'):
            file_path = os.path.join(RESPONSES_DIR, filename)
            try:
                with open(file_path, 'r') as f:
                    response_data = json.load(f)
                    
                # Apply user filter if specified
                if user_filter and response_data.get('user_id') != user_filter:
                    continue
                    
                responses.append(response_data)
            except Exception as e:
                continue
    
    # Sort by creation time (newest first)
    responses.sort(key=lambda x: x.get('created_at', ''), reverse=True)
    
    # Apply limit
    responses = responses[:limit]
    
    return Response({
        'responses': responses,
        'total': len(responses)
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_ai_response(request, response_id):
    """
    Get specific AI response by ID.
    """
    ensure_storage_dir()
    
    file_path = os.path.join(RESPONSES_DIR, f"{response_id}.json")
    
    if not os.path.exists(file_path):
        return Response(
            {'error': 'Response not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        with open(file_path, 'r') as f:
            response_data = json.load(f)
        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': 'Failed to read response'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )