from django.db import models
from django.contrib.auth.models import User
# from django.conf import settings
# customer = models.ForeignKey(settings.AUTH_USER_MODEL, ...)


class Appointment(models.Model):
    description =  models.CharField(max_length=255)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments') 

# from django.contrib.auth.base_user import BaseUserManager
# from django.contrib.auth.models import AbstractUser     

# class CustomUserManager(BaseUserManager):
#     def create_user(self, email, password=None, **extra_fields):
#         if not email:
#             raise ValueError("Email is a required field")
#         email = self.normalize_email(email)
#         user = self.model(email=email, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, password=None, **extra_fields):
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_superuser', True)
#         return self.create_user(email, password, **extra_fields)

# class CustomUser(AbstractUser):
#     email= models.EmailField(max_length=255, unique=True)
#     address= models.CharField(max_length=255)
#     username = models.CharField(max_length = 200, null=True, blank=True)
#     full_name = models.CharField(max_length=255)

#     objects = CustomUserManager()

#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = []
