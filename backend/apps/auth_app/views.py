"""
Authentication views for JWT-based login, registration and profile management.
Uses mocked user data for Ahmedabad Urban Intelligence Platform.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from config.jwt import get_tokens_for_user
import uuid

# Mock user database
MOCK_USERS = {
    'divy': {
        'id': '1',
        'username': 'divy',
        'password': '1234',
        'role': 'government',
        'name': 'Divy Mevada',
        'email': 'tirthpatel3129@gmail.com'
    },
    'tirth': {
        'id': '2',
        'username': 'tirth',
        'password': '1234',
        'role': 'citizen',
        'name': 'Tirth Patel',
        'email': 'tirthpatel1356@gmail.com'
    }
}


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    User registration endpoint.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    name = request.data.get('name')
    email = request.data.get('email')
    role = request.data.get('role', 'citizen')  # Default to citizen
    
    # Validation
    if not all([username, password, name, email]):
        return Response(
            {'error': 'Username, password, name, and email are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if user already exists
    if username in MOCK_USERS:
        return Response(
            {'error': 'Username already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if email already exists
    for user in MOCK_USERS.values():
        if user.get('email') == email:
            return Response(
                {'error': 'Email already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Validate role
    if role not in ['citizen', 'government']:
        return Response(
            {'error': 'Role must be either "citizen" or "government"'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create new user
    new_user = {
        'id': str(len(MOCK_USERS) + 1),
        'username': username,
        'password': password,
        'role': role,
        'name': name,
        'email': email
    }
    
    # Add to mock database
    MOCK_USERS[username] = new_user
    
    # Generate JWT tokens
    tokens = get_tokens_for_user(new_user)
    
    # Prepare user data (exclude password)
    user_data = {
        'id': new_user['id'],
        'username': new_user['username'],
        'role': new_user['role'],
        'name': new_user['name'],
        'email': new_user['email']
    }
    
    return Response({
        'message': 'User registered successfully',
        'access': tokens['access'],
        'refresh': tokens['refresh'],
        'user': user_data
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    User login endpoint using username and password.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if user exists in mock database
    user = MOCK_USERS.get(username)
    
    if not user or user['password'] != password:
        return Response(
            {'error': 'Invalid username or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Generate JWT tokens
    tokens = get_tokens_for_user(user)
    
    # Prepare user data (exclude password)
    user_data = {
        'id': user['id'],
        'username': user['username'],
        'role': user['role'],
        'name': user.get('name', ''),
        'email': user.get('email', '')
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
    """
    # For mocked implementation, we'll try to get user from request.user
    # or fallback to query param for manual testing
    username = request.query_params.get('username')
    
    if not username:
        # In a real JWT setup, request.user would be populated
        # but since we are mocking, we can extract from token manually if needed
        # For now, let's allow passing username or use a default
        username = 'tirth'
        
    user = MOCK_USERS.get(username)
    
    if not user:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    user_data = {
        'id': user['id'],
        'username': user['username'],
        'role': user['role'],
        'name': user.get('name', ''),
        'email': user.get('email', '')
    }
    
    return Response(user_data, status=status.HTTP_200_OK)
