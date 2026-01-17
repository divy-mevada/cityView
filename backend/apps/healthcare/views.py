"""
Healthcare views for capacity and facility data.
"""
from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from services.healthcare_service import get_healthcare_by_location


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def capacity(request):
    """
    Get healthcare capacity data for city or specific location.
    
    Query params:
        - locality: Optional locality filter
        - ward: Optional ward filter
    
    Response:
        {
            "city_average_utilization": 82,
            "zones": [...],
            "total_beds": 5000,
            "available_beds": 900
        }
    """
    # Simplified city-wide healthcare data
    zone_data = [
        {'zone': 'West Zone', 'utilization': 78, 'total_beds': 1200, 'available_beds': 264},
        {'zone': 'East Zone', 'utilization': 85, 'total_beds': 1500, 'available_beds': 225},
        {'zone': 'North Zone', 'utilization': 80, 'total_beds': 1100, 'available_beds': 220},
        {'zone': 'South Zone', 'utilization': 82, 'total_beds': 1200, 'available_beds': 216}
    ]
    
    total_beds = sum(z['total_beds'] for z in zone_data)
    available_beds = sum(z['available_beds'] for z in zone_data)
    city_avg = sum(z['utilization'] for z in zone_data) // len(zone_data)
    
    return Response({
        'city_average_utilization': city_avg,
        'zones': zone_data,
        'total_beds': total_beds,
        'available_beds': available_beds,
        'timestamp': datetime.now().isoformat()
    }, status=status.HTTP_200_OK)
