"""
Forecast Service - Handles timeline-based predictions for urban metrics.
Uses rule-based and trend-based simulation (no ML required).
"""
from datetime import datetime, timedelta
from utils.helpers import generate_trend_data
from services.aqi_service import get_current_aqi
from services.traffic_service import MOCK_TRAFFIC_DATA


def get_area_forecast(zone=None, ward=None, locality=None, timeline='3months'):
    """
    Get forecast for an area over specified timeline.
    
    Args:
        zone: Optional zone name
        ward: Optional ward name
        locality: Optional locality name
        timeline: '1month', '3months', or '6months'
    
    Returns:
        dict: Forecast data for all metrics
    """
    # Determine months from timeline
    months_map = {'1month': 1, '3months': 3, '6months': 6}
    months = months_map.get(timeline, 3)
    
    # Get current AQI data
    current_aqi = get_current_aqi(zone=zone, ward=ward)
    base_aqi = current_aqi['city_average']
    
    # Get current traffic (simplified)
    base_traffic = 72  # Default
    if locality and locality in MOCK_TRAFFIC_DATA:
        base_traffic = MOCK_TRAFFIC_DATA[locality]['base_congestion']
    
    # Base values for other metrics
    base_healthcare = 82
    base_education = 88
    base_urban_dev = 70
    
    # Generate forecasts with trends
    aqi_forecast = generate_trend_data(base_aqi, months, 'increasing', variance=8)
    traffic_forecast = generate_trend_data(base_traffic, months, 'increasing', variance=5)
    healthcare_forecast = generate_trend_data(base_healthcare, months, 'stable', variance=3)
    education_forecast = generate_trend_data(base_education, months, 'increasing', variance=2)
    urban_dev_forecast = generate_trend_data(base_urban_dev, months, 'increasing', variance=5)
    
    # Calculate projected changes
    aqi_change = (aqi_forecast[-1]['value'] - base_aqi) if aqi_forecast else 0
    traffic_change = (traffic_forecast[-1]['value'] - base_traffic) if traffic_forecast else 0
    
    return {
        'timeline': timeline,
        'area': {
            'zone': zone or 'Ahmedabad',
            'ward': ward,
            'locality': locality
        },
        'forecasts': {
            'aqi': {
                'current': base_aqi,
                'projected': aqi_forecast[-1]['value'] if aqi_forecast else base_aqi,
                'change': round(aqi_change, 1),
                'trend': 'increasing' if aqi_change > 0 else 'decreasing' if aqi_change < 0 else 'stable',
                'data': aqi_forecast
            },
            'traffic': {
                'current': base_traffic,
                'projected': traffic_forecast[-1]['value'] if traffic_forecast else base_traffic,
                'change': round(traffic_change, 1),
                'trend': 'increasing' if traffic_change > 0 else 'decreasing' if traffic_change < 0 else 'stable',
                'data': traffic_forecast
            },
            'healthcare': {
                'current': base_healthcare,
                'projected': healthcare_forecast[-1]['value'] if healthcare_forecast else base_healthcare,
                'data': healthcare_forecast,
                'impact': 'Capacity utilization expected to remain stable with current trends'
            },
            'education': {
                'current': base_education,
                'projected': education_forecast[-1]['value'] if education_forecast else base_education,
                'data': education_forecast,
                'impact': 'Enrollment pressure expected to increase with population growth'
            },
            'urban_development': {
                'current': base_urban_dev,
                'projected': urban_dev_forecast[-1]['value'] if urban_dev_forecast else base_urban_dev,
                'data': urban_dev_forecast,
                'impact': 'Development activity expected to increase with new projects'
            }
        },
        'assumptions': [
            'Based on current trends and seasonal patterns',
            'Assumes no major infrastructure changes',
            'Considers population growth estimates',
            'Accounts for planned development projects'
        ],
        'generated_at': datetime.now().isoformat()
    }
