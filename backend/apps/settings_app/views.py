from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
import os
import requests
import json

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow saving keys without auth for easier setup
def api_keys(request):
    """
    Store API keys for What-If chatbot and other services.
    These are stored in environment variables for the current session.
    """
    try:
        api_keys_data = request.data
        
        # Store API keys in environment (session-level)
        # Note: These won't persist after server restart
        # For production, update actual .env file or use secure key management
        
        keys_mapping = {
            'groqApiKey': 'GROQ_API_KEY',
            'openaiOssApiKey': 'OPENAI_OSS_API_KEY',
            'geminiApiKey': 'GEMINI_API_KEY',
            'tomtomApiKey': 'TOMTOM_API_KEY',
            'aqicnApiKey': 'AQICN_API_KEY'
        }
        
        updated_keys = []
        for frontend_key, env_key in keys_mapping.items():
            if frontend_key in api_keys_data and api_keys_data[frontend_key]:
                # Set in environment for current process
                os.environ[env_key] = api_keys_data[frontend_key]
                updated_keys.append(env_key)
        
        return Response({
            'message': 'API keys updated successfully',
            'updated_keys': updated_keys,
            'note': 'Keys are active for current session. Restart server to persist via environment variables.'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def what_if(request):
    """
    Proxy endpoint for What-If chatbot.
    Forwards requests to the FastAPI AI server on port 8001 (or configured port).
    """
    try:
        # Forward to FastAPI AI server
        # Update port if AI server runs on different port
        ai_server_url = os.environ.get('AI_SERVER_URL', 'http://localhost:8001')
        
        # Get API key from request if provided, otherwise from environment
        request_data = request.data.copy()
        if 'groq_api_key' not in request_data:
            # Try to get from environment
            groq_key = os.environ.get('GROQ_API_KEY')
            if groq_key:
                request_data['groq_api_key'] = groq_key
        
        # Forward request to AI server
        response = requests.post(
            f'{ai_server_url}/api/what-if',
            json=request_data,
            headers={'Content-Type': 'application/json'},
            timeout=60
        )
        
        if response.status_code == 200:
            return Response(response.json(), status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': f'AI server error: {response.text}'},
                status=response.status_code
            )
            
    except requests.exceptions.ConnectionError:
        return Response({
            'error': 'AI server is not running. Please start the AI server on port 8001 or configure AI_SERVER_URL.'
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def ai_files(request):
    """
    Proxy to fetch AI model files from AI server.
    """
    try:
        ai_server_url = os.environ.get('AI_SERVER_URL', 'http://localhost:8001')
        response = requests.get(f'{ai_server_url}/api/models/files', timeout=10)
        
        if response.status_code == 200:
            return Response(response.json(), status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Failed to fetch file list'}, status=response.status_code)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
