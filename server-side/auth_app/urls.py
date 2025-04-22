from django.urls import path
from .views import RegisterUserView, LoginView, AuthenticatedCheckView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('authenticated/', AuthenticatedCheckView.as_view(), name='authenticated'),
]
