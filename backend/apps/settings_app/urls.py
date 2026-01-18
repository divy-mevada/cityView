from django.urls import path
from . import views

urlpatterns = [
    path('api-keys/', views.api_keys, name='api-keys'),
    path('what-if/', views.what_if, name='what-if'),
    path('ai-files/', views.ai_files, name='ai-files'),
]
