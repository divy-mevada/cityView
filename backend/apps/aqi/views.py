"""
AQI (Air Quality Index) views for current and location-based data.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from services.aqi_service import (
    get_current_aqi,
    get_aqi_by_location as get_aqi_by_loc,
    get_aqi_trend
)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current(request):
    """
    Get current city-wide AQI for Ahmedabad.
    
    Query params:
        - zone: Optional zone filter
        - ward: Optional ward filter
    
    Response:
        {
            "city_average": 156,
            "category": "unhealthy",
            "zones": [
                {
                    "zone": "West Zone",
                    "aqi": 145,
                    "category": "unhealthy"
                },
                ...
            ],
            "timestamp": "2024-01-15T10:30:00Z"
        }
    """
    zone = request.query_params.get('zone')
    ward = request.query_params.get('ward')
    
    aqi_data = get_current_aqi(zone=zone, ward=ward)
    
    return Response(aqi_data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def by_location(request):
    """
    Get AQI data for a specific location.
    
    Request body:
        {
            "latitude": 23.0225,
            "longitude": 72.5714,
            "locality": "SG Highway"  // Optional
        }
    
    Response:
        {
            "locality": "SG Highway",
            "ward": "Vastrapur",
            "aqi": {
                "value": 156,
                "category": "unhealthy",
                "pm25": 65,
                "pm10": 120,
                "no2": 45,
                "trend": "increasing"
            },
            "nearest_station": {
                "name": "Vastrapur AQI Station",
                "distance_km": 2.5
            }
        }
    """
    lat = request.data.get('latitude')
    lng = request.data.get('longitude')
    locality = request.data.get('locality')
    
    if not lat or not lng:
        return Response(
            {'error': 'Latitude and longitude are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        lat = float(lat)
        lng = float(lng)
    except (ValueError, TypeError):
        return Response(
            {'error': 'Invalid latitude or longitude format'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    aqi_data = get_aqi_by_loc(lat, lng, locality)
    
    return Response(aqi_data, status=status.HTTP_200_OK)
