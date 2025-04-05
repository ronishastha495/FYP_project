from django.urls import path
from .views import RegisterView, LoginView, PasswordResetView, ChangePasswordView, CheckAuthenticationView, LogoutView, UserProfileView, ServiceManagerProfileView, UserDetailsView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('password-reset/', PasswordResetView.as_view(), name='password_reset'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('authenticated/', CheckAuthenticationView.as_view(), name='check_authentication'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('service_manager/profile/', ServiceManagerProfileView.as_view(), name='service_manager_profile'),
    path('user/', UserDetailsView.as_view(), name='user_details'),
]
