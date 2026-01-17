"""
Education views for school infrastructure and capacity data.
"""
from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from services.education_service import get_education_by_location


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def capacity(request):
    """
    Get education capacity data for city or specific location.
    
    Query params:
        - locality: Optional locality filter
        - ward: Optional ward filter
    
    Response:
        {
            "city_average_stress": 88,
            "zones": [...],
            "total_schools": 500,
            "overcrowded_schools": 45
        }
    """
    # Simplified city-wide education data
    zone_data = [
        {'zone': 'West Zone', 'stress': 90, 'total_schools': 120, 'overcrowded': 12},
        {'zone': 'East Zone', 'stress': 88, 'total_schools': 140, 'overcrowded': 15},
        {'zone': 'North Zone', 'stress': 85, 'total_schools': 110, 'overcrowded': 10},
        {'zone': 'South Zone', 'stress': 87, 'total_schools': 130, 'overcrowded': 8}
    ]
    
    total_schools = sum(z['total_schools'] for z in zone_data)
    overcrowded = sum(z['overcrowded'] for z in zone_data)
    city_avg = sum(z['stress'] for z in zone_data) // len(zone_data)
    
    return Response({
        'city_average_stress': city_avg,
        'zones': zone_data,
        'total_schools': total_schools,
        'overcrowded_schools': overcrowded,
        'timestamp': datetime.now().isoformat()
    }, status=status.HTTP_200_OK)
