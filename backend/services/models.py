# services/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone

# Vehicle Model
class Vehicle(models.Model):
    make = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    year = models.CharField(max_length=4)
    vin = models.CharField(max_length=17, unique=True)
    image = models.ImageField(upload_to="vehicle_images/", blank=True, null=True)

    def __str__(self):
        return f"{self.make} {self.model} ({self.year})"

# Service Model
class Servicing(models.Model):
    name = models.CharField(max_length=200)  # Name of the service
    description = models.TextField(blank=True)  # Description of the service
    cost = models.DecimalField(max_digits=10, decimal_places=2)  # Cost of the service
    image = models.ImageField(upload_to='service_images/', null=True, blank=True)  # Service image

    def __str__(self):
        return self.name

# Service History Model
class ServiceHistory(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)  # Link to the vehicle
    service_date = models.DateField()  # Date of service
    service_type = models.CharField(max_length=200)  # Type of service (e.g., Oil Change)
    cost = models.DecimalField(max_digits=10, decimal_places=2)  # Cost of service
    notes = models.TextField(blank=True)  # Additional notes

    def __str__(self):
        return f"{self.service_type} on {self.service_date}"

# Booking Model
class Booking(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Link to the user
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)  # Link to the vehicle
    service = models.ForeignKey(Servicing, on_delete=models.CASCADE)  # Link to the service
    date = models.DateField()  # Booking date
    time = models.TimeField()  # Booking time
    is_confirmed = models.BooleanField(default=False)  # Whether the booking is confirmed

    def __str__(self):
        return f"Booking for {self.vehicle} on {self.date} at {self.time}"

# Reminder Model
class Reminder(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)  # Link to the booking
    message = models.TextField()  # Reminder message
    reminder_date = models.DateField()  # Reminder date
    reminder_time = models.TimeField()  # Reminder time
    is_sent = models.BooleanField(default=False)  # Whether the reminder has been sent

    def __str__(self):
        return f"Reminder for {self.booking} on {self.reminder_date} at {self.reminder_time}"

# Notification Model
class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Link to the user
    message = models.TextField()  # Notification message
    timestamp = models.DateTimeField(default=timezone.now)  # Timestamp of the notification
    is_read = models.BooleanField(default=False)  # Whether the notification has been read

    def __str__(self):
        return f"Notification for {self.user} at {self.timestamp}"