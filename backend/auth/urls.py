from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('account/', include('account.urls')),  # Include URLs from your 'account' app
    path('services/', include('services.urls')),  # Include URLs from your 'services' app
    path('dashboard/', include('dashboard.urls')),  # Include URLs from your 'dashboard' app
    path('notifications/', include('notifications.urls')),  # Include URLs from your 'notifications' app
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    