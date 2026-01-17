"""
URL routing for forecasting endpoints.
"""
from django.urls import path
from . import views

app_name = 'forecasting'

urlpatterns = [
    path('area/', views.area, name='area'),
]
