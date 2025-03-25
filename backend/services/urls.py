# services/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet, ServicingViewSet, ServiceHistoryViewSet, BookingViewSet, ReminderViewSet, NotificationViewSet

router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet)
router.register(r'servicing', ServicingViewSet)
router.register(r'service-histories', ServiceHistoryViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'reminders', ReminderViewSet)
router.register(r'notifications', NotificationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]