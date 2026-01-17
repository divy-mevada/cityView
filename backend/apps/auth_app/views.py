"""
Authentication views for JWT-based login and profile management.
Uses mocked user data for Ahmedabad Urban Intelligence Platform.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from config.jwt import get_tokens_for_user

# Mock user database (to be replaced with PostgreSQL later)
MOCK_USERS = {
    'tirthpatel1356@gmail.com': {
        'id': '1',
        'email': 'tirthpatel1356@gmail.com',
        'password': '1234',  # In production, use hashed passwords
        'role': 'citizen',
        'name': 'Tirth Patel',
        'phone': '+919876543210'
    },
    'tirthpatel3129@gmail.com': {
        'id': '2',
        'email': 'tirthpatel3129@gmail.com',
        'password': '1234',
        'role': 'government',
        'name': 'Tirth Patel (Gov)',
        'phone': '+919876543211'
    }
}


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    User login endpoint.
    
    Request body:
        {
            "email": "user@example.com",
            "password": "password123"
        }
    
    Response:
        {
            "access": "jwt-access-token",
            "refresh": "jwt-refresh-token",
            "user": {
                "id": "1",
                "email": "user@example.com",
                "role": "citizen",
                "name": "User Name"
            }
        }
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if user exists in mock database
    user = MOCK_USERS.get(email)
    
    if not user or user['password'] != password:
        return Response(
            {'error': 'Invalid email or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Generate JWT tokens
    tokens = get_tokens_for_user(user)
    
    # Prepare user data (exclude password)
    user_data = {
        'id': user['id'],
        'email': user['email'],
        'role': user['role'],
        'name': user.get('name', ''),
        'phone': user.get('phone', '')
    }
    
    return Response({
        'access': tokens['access'],
        'refresh': tokens['refresh'],
        'user': user_data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """
    Get current user profile.
    
    Requires: Bearer token in Authorization header
    
    Response:
        {
            "id": "1",
            "email": "user@example.com",
            "role": "citizen",
            "name": "User Name",
            "phone": "+919876543210"
        }
    """
    # Extract user info from token (mocked - in production, decode JWT)
    # For now, we'll use a simple lookup based on email from token payload
    # In a real implementation, you'd decode the JWT and get the user_id
    
    # Mock: Get user by ID from token (simplified)
    # In production, decode JWT token to get user_id
    user_id = getattr(request.user, 'id', None) if hasattr(request.user, 'id') else None
    
    # For mocked implementation, get user from email in request
    email = request.query_params.get('email') or 'tirthpatel1356@gmail.com'
    user = MOCK_USERS.get(email)
    
    if not user:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    user_data = {
        'id': user['id'],
        'email': user['email'],
        'role': user['role'],
        'name': user.get('name', ''),
        'phone': user.get('phone', '')
    }
    
    return Response(user_data, status=status.HTTP_200_OK)
