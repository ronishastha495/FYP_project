from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('users/', include('users.urls')),
    # path('autocare/', include('autocare.urls')),
    path('account/', include('account.urls')),
    path('services/', include('services.urls')),
    path('chat/', include('chat.urls')),
]