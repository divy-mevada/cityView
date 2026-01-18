from django.urls import path
from . import views

urlpatterns = [
    path('store/', views.store_ai_response, name='store_ai_response'),
    path('list/', views.get_ai_responses, name='get_ai_responses'),
    path('<str:response_id>/', views.get_ai_response, name='get_ai_response'),
]