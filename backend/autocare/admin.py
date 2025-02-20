from django.contrib import admin
from .models import Vehicle, ServiceHistory, Booking, Reminder

# Register your models here.

admin.site.register(Vehicle)
admin.site.register(ServiceHistory)
admin.site.register(Booking)
admin.site.register(Reminder)