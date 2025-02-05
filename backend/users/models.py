from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager

# Create your models here. 

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is a must required field, So please provide an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self.db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    full_name = models.CharField(max_length=200)
    email = models.EmailField(max_length=200, unique=True)
    username = models.CharField(max_length=200, null = True, blank= True)

    objects = CustomUserManager()
    
    USERNAME_FIELD ='email'# Using email as the unique identifier for authentication
    REQUIRED_FIELDS = [] # Adding 'full_name' to required fields (if you want it to be required during user creation)   # Exclude 'email' because it's already the username field