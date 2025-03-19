# services/urls.py
from django.urls import path
from .views import (
    VehicleListView, VehicleDetailView,
    ServiceHistoryListView, ServiceHistoryDetailView,
    BookingListView, BookingDetailView,
    ReminderListView, ReminderDetailView,
)

urlpatterns = [
    # Vehicle URLs
    path('vehicles/', VehicleListView.as_view(), name='vehicle-list'),
    path('vehicles/<int:pk>/', VehicleDetailView.as_view(), name='vehicle-detail'),

    # Service History URLs
    path('service-history/', ServiceHistoryListView.as_view(), name='service-history-list'),
    path('service-history/<int:pk>/', ServiceHistoryDetailView.as_view(), name='service-history-detail'),

    # Booking URLs
    path('bookings/', BookingListView.as_view(), name='booking-list'),
    path('bookings/<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),

    # Reminder URLs
    path('reminders/', ReminderListView.as_view(), name='reminder-list'),
    path('reminders/<int:pk>/', ReminderDetailView.as_view(), name='reminder-detail'),
]