from django.contrib.auth.models import AbstractUser
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('service_manager', 'Service Manager'),
        ('customer', 'Customer'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    phone_number = models.CharField(max_length=15, unique=True, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return self.username

# General User Profile (For All Users)
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

# Service Manager Profile (Extra Fields for Service Managers)
class ServiceManagerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='service_manager_profile')
    service_center_name = models.CharField(max_length=255, blank=True, null=True)
    experience_years = models.IntegerField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    contact_number = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.service_center_name or 'No Service Center'}"

# Auto-create UserProfile for ALL users and ServiceManagerProfile for service managers
@receiver(post_save, sender=User)
def create_profiles(sender, instance, created, **kwargs):
    if created:
        # Create UserProfile for all users
        UserProfile.objects.create(user=instance)

        # Create ServiceManagerProfile only for service managers
        if instance.role == 'service_manager':
            ServiceManagerProfile.objects.create(user=instance)
