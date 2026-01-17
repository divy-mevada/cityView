"""
Middleware for role-based access control.
"""
from rest_framework.permissions import BasePermission


class IsGovernmentUser(BasePermission):
    """
    Permission class to check if user has government role.
    """
    message = 'You do not have permission to perform this action. Government access required.'
    
    def has_permission(self, request, view):
        # In production, decode JWT token to get user role
        # For now, check if role is in request headers or token payload
        role = getattr(request.user, 'role', None) if hasattr(request.user, 'role') else None
        
        # Mock: Allow if role header is set (for testing)
        role_header = request.META.get('HTTP_X_USER_ROLE')
        if role_header == 'government':
            return True
        
        return role == 'government'


class IsCitizenOrGovernment(BasePermission):
    """
    Permission class to allow both citizen and government users.
    """
    def has_permission(self, request, view):
        return True  # Both roles can access
