# auth_app/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    LoginView,
    AuthenticatedCheckView,
    AddNewServiceCenterView,
    UserProfileView,
    GetAllVehiclesAPIView,
    AddNewVehicleView,
    RetrieveUpdateDestroyVehicleView,
    GetAllServicesAPIView,
    AddNewServiceView,
    RetrieveUpdateDestroyServicesView,
    ServiceCenterViewSet,  LogoutView,
)

router = DefaultRouter()
router.register(r'service-centers', ServiceCenterViewSet, basename='service-centers')

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('authenticated/', AuthenticatedCheckView.as_view(), name='auth-check'),
    
    # User profile endpoint
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
    
    # Vehicle endpoints
    path('vehicles/all/', GetAllVehiclesAPIView.as_view(), name='vehicle-list'),
    path('vehicle/create/', AddNewVehicleView.as_view(), name='vehicle-create'),
    path('vehicle/<uuid:pk>/', RetrieveUpdateDestroyVehicleView.as_view(), name='vehicle-detail'),
    
    # Service endpoints
    path('services/all/', GetAllServicesAPIView.as_view(), name='service-list'),
    path('services/create/', AddNewServiceView.as_view(), name='service-create'),
    path('services/<uuid:pk>/', RetrieveUpdateDestroyServicesView.as_view(), name='service-detail'),
    
    # Service Center endpoints (via ViewSet)
    path('service-center/create/', AddNewServiceCenterView.as_view(), name='service-center-create'),
    
    # Include router URLs last
    path('', include(router.urls)),
]