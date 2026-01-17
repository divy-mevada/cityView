"""
URL routing for AQI endpoints.
"""
from django.urls import path
from . import views

app_name = 'aqi'

urlpatterns = [
    path('current/', views.current, name='current'),
    path('by-location/', views.by_location, name='by-location'),
]
