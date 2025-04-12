# services/admin.py
from django.contrib import admin
from .models import *


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ['make', 'model', 'year', 'vin']
    search_fields = ['make', 'model', 'vin']

@admin.register(Servicing)
class ServicingAdmin(admin.ModelAdmin):
    list_display = ['name', 'cost']
    search_fields = ['name']

@admin.register(ServiceHistory)
class ServiceHistoryAdmin(admin.ModelAdmin):
    list_display = ['vehicle', 'service_date', 'service_type', 'cost']
    search_fields = ['vehicle__make', 'service_type']

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['user', 'vehicle', 'primary_service', 'date', 'time', 'status']
    search_fields = ['user__username', 'vehicle__make']

@admin.register(UserFavourites)
class UserFavouriteAdmin(admin.ModelAdmin):
    search_fields = ['user']