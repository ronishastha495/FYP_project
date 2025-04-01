from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings
from services.models import Booking

class UserAnalytics(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_spent = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    services_completed = models.PositiveIntegerField(default=0)
    last_service_date = models.DateField(null=True, blank=True)
    average_rating = models.FloatField(default=0)

    def __str__(self):
        return f"Analytics for {self.user}"

class AdminTracking(models.Model):
    ACTION_CHOICES = (
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
    )
    
    admin = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    model = models.CharField(max_length=50)
    object_id = models.PositiveIntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['admin', 'timestamp']),
        ]

    def __str__(self):
        return f"{self.admin} {self.action}d {self.model} #{self.object_id}"

class Rating(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    review = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.rating}★ for Booking #{self.booking.id}"