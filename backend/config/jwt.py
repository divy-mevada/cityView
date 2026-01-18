"""
JWT configuration and utility functions for token generation.
"""
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings


def get_tokens_for_user(user):
    """
    Generate JWT tokens for a user.
    
    Args:
        user: Django user object (mocked for now)
    
    Returns:
        dict: Contains 'access' and 'refresh' tokens
    """
    refresh = RefreshToken()
    
    # Add custom claims to token
    refresh['user_id'] = user.get('id', '')
    refresh['username'] = user.get('username', '')
    refresh['role'] = user.get('role', 'citizen')
    
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
