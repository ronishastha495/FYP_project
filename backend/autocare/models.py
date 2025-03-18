from django.db import models
from django.conf import settings

# Vehicle Model
class Vehicle(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Link to the user
    make = models.CharField(max_length=100)  # Vehicle make (e.g., Toyota)
    model = models.CharField(max_length=100)  # Vehicle model (e.g., Corolla)
    year = models.IntegerField()  # Manufacturing year
    vin = models.CharField(max_length=17, unique=True)  # Vehicle Identification Number

    def __str__(self):
        return f"{self.make} {self.model} ({self.year})"

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
    service = models.CharField(max_length=200)  # Service type
    date = models.DateField()  # Booking date
    time = models.TimeField()  # Booking time

    def __str__(self):
        return f"Booking for {self.vehicle} on {self.date} at {self.time}"

# Reminder Model
class Reminder(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Link to the user
    message = models.TextField()  # Reminder message
    date = models.DateField()  # Reminder date
    time = models.TimeField()  # Reminder time

    def __str__(self):
        return f"Reminder for {self.user} on {self.date} at {self.time}"
