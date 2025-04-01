from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, OTPViewSet

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'otp', OTPViewSet, basename='otp')

urlpatterns = [
    path('', include(router.urls)),
]