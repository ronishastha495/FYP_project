from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('account/', include('account.urls')),
    path('services/', include('services.urls')),
    # path('chat/', include('chat.urls')),
]