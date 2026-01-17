"""
URL routing for scenarios endpoints.
"""
from django.urls import path
from . import views

app_name = 'scenarios'

urlpatterns = [
    path('save/', views.save, name='save'),
    path('list/', views.list, name='list'),
    path('compare/', views.compare, name='compare'),
]
