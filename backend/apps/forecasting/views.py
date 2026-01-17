"""
Forecasting views for timeline-based predictions.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from services.forecast_service import get_area_forecast


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def area(request):
    """
    Get forecast for an area over specified timeline.
    
    Request body:
        {
            "zone": "West Zone",  // Optional
            "ward": "Vastrapur",  // Optional
            "locality": "SG Highway",  // Optional
            "timeline": "3months"  // "1month", "3months", "6months"
        }
    
    Response:
        {
            "timeline": "3months",
            "forecasts": {
                "aqi": {...},
                "traffic": {...},
                "healthcare": {...},
                "education": {...},
                "urban_development": {...}
            },
            "trends": {...}
        }
    """
    zone = request.data.get('zone')
    ward = request.data.get('ward')
    locality = request.data.get('locality')
    timeline = request.data.get('timeline', '3months')
    
    # Validate timeline
    valid_timelines = ['1month', '3months', '6months']
    if timeline not in valid_timelines:
        return Response(
            {'error': f'Invalid timeline. Must be one of: {", ".join(valid_timelines)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    forecast_data = get_area_forecast(zone, ward, locality, timeline)
    
    return Response(forecast_data, status=status.HTTP_200_OK)
