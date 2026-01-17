"""
Map-related views for reverse geocoding and area metrics.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from utils.geocoding import reverse_geocode_tomtom
from services.aqi_service import get_aqi_by_location
from services.traffic_service import get_traffic_by_location
from services.healthcare_service import get_healthcare_by_location
from services.education_service import get_education_by_location
from services.urban_dev_service import get_urban_dev_by_location


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reverse_geocode(request):
    """
    Reverse geocode coordinates to get locality information.
    
    Request body:
        {
            "latitude": 23.0225,
            "longitude": 72.5714
        }
    
    Response:
        {
            "locality": "SG Highway",
            "ward": "Vastrapur",
            "zone": "West Zone",
            "address": "SG Highway, Vastrapur, Ahmedabad"
        }
    """
    lat = request.data.get('latitude')
    lng = request.data.get('longitude')
    
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
    
    # Use TomTom reverse geocoding (mocked)
    result = reverse_geocode_tomtom(lat, lng)
    
    return Response(result, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def area_metrics(request):
    """
    Get comprehensive area metrics for a location (lat, lng).
    
    Request body:
        {
            "latitude": 23.0225,
            "longitude": 72.5714
        }
    
    Response:
        {
            "locality": {
                "name": "SG Highway",
                "ward": "Vastrapur",
                "zone": "West Zone",
                "address": "SG Highway, Vastrapur, Ahmedabad"
            },
            "aqi": {
                "value": 156,
                "category": "unhealthy",
                "trend": "increasing",
                "components": {...}
            },
            "traffic": {
                "congestion_index": 72,
                "status": "moderate",
                "peak_hours": [...]
            },
            "healthcare": {
                "hospitals": [...],
                "capacity_utilization": 85,
                "nearest_facilities": [...]
            },
            "education": {
                "schools": [...],
                "capacity_stress": 91,
                "enrollment_rate": 0.95
            },
            "urban_development": {
                "activity_score": 68,
                "ongoing_projects": [...],
                "planned_projects": [...]
            }
        }
    """
    lat = request.data.get('latitude')
    lng = request.data.get('longitude')
    
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
    
    # Get locality info
    locality_info = reverse_geocode_tomtom(lat, lng)
    
    # Get metrics from various services
    aqi_data = get_aqi_by_location(lat, lng, locality_info['locality'])
    traffic_data = get_traffic_by_location(lat, lng, locality_info['locality'])
    healthcare_data = get_healthcare_by_location(locality_info['locality'], locality_info['ward'])
    education_data = get_education_by_location(locality_info['locality'], locality_info['ward'])
    urban_dev_data = get_urban_dev_by_location(locality_info['locality'], locality_info['ward'])
    
    return Response({
        'locality': locality_info,
        'aqi': aqi_data,
        'traffic': traffic_data,
        'healthcare': healthcare_data,
        'education': education_data,
        'urban_development': urban_dev_data
    }, status=status.HTTP_200_OK)
