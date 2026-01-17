"""
Urban Development views for project and activity data.
"""
from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from services.urban_dev_service import get_urban_dev_by_location


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def activity(request):
    """
    Get urban development activity data for city.
    
    Response:
        {
            "city_average_score": 70,
            "zones": [...],
            "total_ongoing_projects": 25,
            "total_planned_projects": 15
        }
    """
    # Simplified city-wide urban dev data
    zone_data = [
        {'zone': 'West Zone', 'score': 75, 'ongoing': 8, 'planned': 5},
        {'zone': 'East Zone', 'score': 68, 'ongoing': 6, 'planned': 4},
        {'zone': 'North Zone', 'score': 72, 'ongoing': 7, 'planned': 3},
        {'zone': 'South Zone', 'score': 65, 'ongoing': 4, 'planned': 3}
    ]
    
    total_ongoing = sum(z['ongoing'] for z in zone_data)
    total_planned = sum(z['planned'] for z in zone_data)
    city_avg = sum(z['score'] for z in zone_data) // len(zone_data)
    
    return Response({
        'city_average_score': city_avg,
        'zones': zone_data,
        'total_ongoing_projects': total_ongoing,
        'total_planned_projects': total_planned,
        'timestamp': datetime.now().isoformat()
    }, status=status.HTTP_200_OK)
