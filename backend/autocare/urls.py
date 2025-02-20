from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard, name='dashboard'),
    path('search-services/', views.search_services, name='search_services'),
    path('add-booking/', views.add_booking, name='add_booking'),
]