from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DashboardViewSet, AdminDashboardViewSet, RatingViewSet

router = DefaultRouter()
router.register(r'dashboard', DashboardViewSet, basename='dashboard')
router.register(r'admin-dashboard', AdminDashboardViewSet, basename='admin-dashboard')
router.register(r'ratings', RatingViewSet, basename='rating')

urlpatterns = [
    path('', include(router.urls)),
]