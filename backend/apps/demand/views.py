"""
Demand and footfall estimation views.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from services.demand_service import estimate_demand


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def estimate(request):
    """
    Estimate demand and footfall for an area.
    
    Request body:
        {
            "zone": "West Zone",  // Optional
            "ward": "Vastrapur",  // Optional
            "locality": "SG Highway",  // Optional
            "population_density": 8500,  // Optional (per sq km)
            "traffic_inflow": 1200,  // Optional (vehicles/hour)
            "infrastructure_density": 0.75  // Optional (0-1 scale)
        }
    
    Response:
        {
            "daily_footfall": 1250,
            "peak_hour_demand": 280,
            "demand_index": "High",
            "factors": {...},
            "recommendations": [...]
        }
    """
    zone = request.data.get('zone')
    ward = request.data.get('ward')
    locality = request.data.get('locality')
    population_density = request.data.get('population_density')
    traffic_inflow = request.data.get('traffic_inflow')
    infrastructure_density = request.data.get('infrastructure_density')
    
    demand_data = estimate_demand(
        zone=zone,
        ward=ward,
        locality=locality,
        population_density=population_density,
        traffic_inflow=traffic_inflow,
        infrastructure_density=infrastructure_density
    )
    
    return Response(demand_data, status=status.HTTP_200_OK)
