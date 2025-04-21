import uuid
from auth_app.models import Vehicle, Servicing
from django.db import models
from django.conf import settings

# Create your models here.
class ServiceBooking(models.Model):
    BOOKING_STATUS = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    booking_id = models.UUIDField(primary_key=True, unique=True, null=False, editable=False ,default=uuid.uuid4)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=BOOKING_STATUS, default='pending')
    date = models.DateField()
    time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True, null=True)
    service = models.ForeignKey(Servicing, on_delete=models.SET_NULL, null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=False, default=0.00)

    def __str__(self):
        return f"Service booking for {self.user.username if self.user else 'Unknown'} on {self.date} at {self.time}"


class VehicleBooking(models.Model):
    BOOKING_STATUS = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    booking_id = models.UUIDField(primary_key=True, unique=True, null=False, editable=False ,default=uuid.uuid4)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=BOOKING_STATUS, default='pending')
    date = models.DateField()
    time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Associated Vehicle")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=False, default=0.00)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Vehicle purchase booking for {self.user.username if self.user else 'Unknown'} on {self.date} at {self.time}"


class Favorite(models.Model):
    """Model for storing user favorites (services or vehicles)"""
    TYPE_CHOICES = (
        ('service', 'Service'),
        ('vehicle', 'Vehicle'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    service = models.ForeignKey(Servicing, on_delete=models.CASCADE, null=True, blank=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [
            ('user', 'service'),
            ('user', 'vehicle')
        ]
        # Ensure a user can't favorite the same item twice
        constraints = [
            models.CheckConstraint(
                check=(
                    models.Q(type='service', service__isnull=False, vehicle__isnull=True) |
                    models.Q(type='vehicle', vehicle__isnull=False, service__isnull=True)
                ),
                name='favorite_type_consistency'
            )
        ]

    def __str__(self):
        if self.type == 'service':
            return f"{self.user.username}'s favorite service: {self.service.name}"
        else:
            return f"{self.user.username}'s favorite vehicle: {self.vehicle.make} {self.vehicle.model}"
