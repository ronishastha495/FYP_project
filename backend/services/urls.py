# services/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'servicing', ServicingViewSet, basename='service')
router.register(r'service-history', ServiceHistoryViewSet, basename='servicehistory')
router.register(r'favourites', FavouritesViewSet, basename='userfavourites')
router.register(r'bookings', VehicleBookingViewSet, basename="bookVehicelPurchase")

urlpatterns = [
    path('', include(router.urls)),
    path('api/total-service-count', returnTotalServiceCount),
    path('api/total-booking-count/', returnTotalAppoitmentCount),

]