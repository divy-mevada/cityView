"""
URL routing for urban development endpoints.
"""
from django.urls import path
from . import views

app_name = 'urban_dev'

urlpatterns = [
    path('activity/', views.activity, name='activity'),
]
