"""
URL routing for simulation endpoints.
"""
from django.urls import path
from . import views

app_name = 'simulation'

urlpatterns = [
    path('run/', views.run, name='run'),
    path('explain/', views.explain, name='explain'),
    path('', views.predict, name='predict'),
]
