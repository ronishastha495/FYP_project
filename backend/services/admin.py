# services/admin.py
from django.contrib import admin
from .models import Vehicle, Servicing, ServiceHistory, Booking, Reminder, Notification

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ['user', 'make', 'model', 'year', 'vin']
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
    list_display = ['user', 'vehicle', 'service', 'date', 'time', 'is_confirmed']
    search_fields = ['user__username', 'vehicle__make']

@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ['booking', 'reminder_date', 'reminder_time', 'is_sent']
    search_fields = ['booking__user__username']

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'message', 'timestamp', 'is_read']
    search_fields = ['user__username', 'message']