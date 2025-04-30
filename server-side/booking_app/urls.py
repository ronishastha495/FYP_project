from django.urls import path
from .views import *

urlpatterns = [
    path('book-vehicle/', BookVehicleAPIView.as_view(), name='book-vehicle'),
     path('vehicle-booking/<uuid:booking_id>/update-status/', UpdateVehicleBookingStatusView.as_view(), name='vehicle-booking-update-status'),
    #services urls
    path('book-service/', BookServiceAPIView.as_view(), name='book-vehicle'),
    path('service-booking/<uuid:booking_id>/update-status/', UpdateServiceBookingStatusView.as_view(), name='service-booking-update-status'),
    #user's booking
    path('user/bookings/', GetUserBookings.as_view(), name='get_user_bookings'),

    # Token refresh URL
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    
    # Favorites URLs
    path('favorites/', FavoriteListView.as_view(), name='favorite_list'),
    path('favorites/create/', FavoriteCreateView.as_view(), name='favorite_create'),
    path('favorites/<int:pk>/', FavoriteDetailView.as_view(), name='favorite_detail'),
    path('favorites/check/', FavoriteCheckView.as_view(), name='favorite_check'),
    path('favorites/toggle/', FavoriteToggleView.as_view(), name='favorite_toggle'),

        # Missing in your code earlier
    path('auth/check/', AuthCheckView.as_view(), name='auth_check'),

]
