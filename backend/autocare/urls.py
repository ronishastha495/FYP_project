from django.urls import path
from .views import (
    VehicleListCreateView,
    VehicleDetailView,
    ServiceHistoryListCreateView,
    ServiceHistoryDetailView,
    BookingListCreateView,
    BookingDetailView,
    ReminderListCreateView,
    ReminderDetailView,
)
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView, )

urlpatterns = [

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Vehicle URLs
    path('vehicles/', VehicleListCreateView.as_view(), name='vehicle-list-create'),
    path('vehicles/<int:pk>/', VehicleDetailView.as_view(), name='vehicle-detail'),

    # Service History URLs
    path('service-history/', ServiceHistoryListCreateView.as_view(), name='service-history-list-create'),
    path('service-history/<int:pk>/', ServiceHistoryDetailView.as_view(), name='service-history-detail'),

    # Booking URLs
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),
    path('bookings/<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),

    # Reminder URLs
    path('reminders/', ReminderListCreateView.as_view(), name='reminder-list-create'),
    path('reminders/<int:pk>/', ReminderDetailView.as_view(), name='reminder-detail'),
]

