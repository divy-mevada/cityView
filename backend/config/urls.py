from django.contrib import admin
from django.urls import path, include
from apps.simulation import views as simulation_views

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
    path('api/predict/', simulation_views.predict, name='predict_api'),
    path('api/scenarios/', include('apps.scenarios.urls')),
    path('api/ai-responses/', include('apps.ai_responses.urls')),
    path('api/settings/', include('apps.settings_app.urls')),
]
