"""
URL routing for education endpoints.
"""
from django.urls import path
from . import views

app_name = 'education'

urlpatterns = [
    path('capacity/', views.capacity, name='capacity'),
]
