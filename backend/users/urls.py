from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView 
from .views import get_appointments, CustomTokenObtainPairView, CustomRefreshTokenView, logout, is_authenticated, register

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomRefreshTokenView.as_view(), name='token_refresh'),
    path('appointments/', get_appointments),
    path('logout/', logout),
    path('authenticated/', is_authenticated),
    path('register/', register)
]  