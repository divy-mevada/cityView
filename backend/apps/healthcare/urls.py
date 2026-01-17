"""
URL routing for healthcare endpoints.
"""
from django.urls import path
from . import views

app_name = 'healthcare'

urlpatterns = [
    path('capacity/', views.capacity, name='capacity'),
]
