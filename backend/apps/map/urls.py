"""
URL routing for map endpoints.
"""
from django.urls import path
from . import views

app_name = 'map'

urlpatterns = [
    path('reverse-geocode/', views.reverse_geocode, name='reverse-geocode'),
    path('area-metrics/', views.area_metrics, name='area-metrics'),
]
