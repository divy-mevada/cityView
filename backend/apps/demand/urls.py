"""
URL routing for demand endpoints.
"""
from django.urls import path
from . import views

app_name = 'demand'

urlpatterns = [
    path('estimate/', views.estimate, name='estimate'),
]
