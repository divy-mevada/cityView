"""
URL routing for traffic endpoints.
"""
from django.urls import path
from . import views

app_name = 'traffic'

urlpatterns = [
    path('current/', views.current, name='current'),
]
