"""
URL configuration for Ahmedabad Urban Intelligence Platform.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API routes
    path('api/auth/', include('apps.auth_app.urls')),
    path('api/map/', include('apps.map.urls')),
    path('api/aqi/', include('apps.aqi.urls')),
    path('api/traffic/', include('apps.traffic.urls')),
    path('api/healthcare/', include('apps.healthcare.urls')),
    path('api/education/', include('apps.education.urls')),
    path('api/urban-dev/', include('apps.urban_dev.urls')),
    path('api/forecast/', include('apps.forecasting.urls')),
    path('api/demand/', include('apps.demand.urls')),
    path('api/simulation/', include('apps.simulation.urls')),
    path('api/scenarios/', include('apps.scenarios.urls')),
    path('api/ai-responses/', include('apps.ai_responses.urls')),
]
