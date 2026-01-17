"""
Traffic views for congestion data and analytics.
"""
from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from services.traffic_service import get_traffic_by_location


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current(request):
    """
    Get current city-wide traffic congestion.
    
    Response:
        {
            "city_average_congestion": 72,
            "zones": [...],
            "timestamp": "..."
        }
    """
    # Simplified city-wide traffic data
    zone_data = [
        {'zone': 'West Zone', 'congestion': 68, 'status': 'moderate'},
        {'zone': 'East Zone', 'congestion': 78, 'status': 'heavy'},
        {'zone': 'North Zone', 'congestion': 65, 'status': 'moderate'},
        {'zone': 'South Zone', 'congestion': 75, 'status': 'heavy'}
    ]
    
    city_avg = sum(z['congestion'] for z in zone_data) // len(zone_data)
    
    return Response({
        'city_average_congestion': city_avg,
        'zones': zone_data,
        'timestamp': datetime.now().isoformat()
    }, status=status.HTTP_200_OK)
