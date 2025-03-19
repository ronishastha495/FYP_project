from django.urls import path
from .views import RegisterView, LoginView, PasswordResetView, ChangePasswordView, check_authentication, LogoutView 


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('password-reset/', PasswordResetView.as_view(), name='password_reset'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('authenticated/', check_authentication.as_view(), name='check_authentication'),
    path('logout/', LogoutView.as_view(), name='logout'),


]
