# services/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError
from decimal import Decimal

# Vehicle Model
class Vehicle(models.Model):
    make = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    year = models.CharField(max_length=4)
    vin = models.CharField(max_length=17, unique=True)
    image = models.ImageField(upload_to="vehicle_images/", blank=True, null=True)
    price = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
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
    BOOKING_TYPE_CHOICES = (
        ('servicing', 'Vehicle Servicing'),
        ('purchase', 'Vehicle Purchase Inquiry'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    # Core Booking Fields
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    booking_type = models.CharField(max_length=20, choices=BOOKING_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    date = models.DateField()
    time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Vehicle Reference (for both servicing and purchases)
    vehicle = models.ForeignKey(
        'Vehicle', 
        on_delete=models.CASCADE,
        verbose_name="Associated Vehicle"
    )
    VEHICLE_CONTEXT_CHOICES = (
        ('customer_owned', 'Customer-Owned Vehicle'),
        ('dealership_vehicle', 'Dealership Vehicle'),
    )
    vehicle_context = models.CharField(
        max_length=20,
        choices=VEHICLE_CONTEXT_CHOICES,
        help_text="Is this the customer's car or a dealership vehicle?"
    )

    # Service-Specific Fields
    primary_service = models.ForeignKey(
        'Servicing',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='primary_bookings'
    )
    recommended_services = models.ManyToManyField(
        'Servicing',
        blank=True,
        related_name='recommended_bookings'
    )
    service_notes = models.TextField(blank=True)
    technician_notes = models.TextField(blank=True)

    # Purchase-Specific Fields
    purchase_details = models.TextField(blank=True)
    trade_in_vehicle = models.ForeignKey(
        'Vehicle',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='trade_in_inquiries'
    )

    # Cost Management
    base_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    recommended_services_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    tax_rate = models.DecimalField(max_digits=4, decimal_places=2, default=0.00)
    final_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        ordering = ['date', 'time']
        verbose_name = "Booking"
        verbose_name_plural = "Bookings"

    def __str__(self):
        return f"{self.get_booking_type_display()} - {self.vehicle} ({self.date})"

    def clean(self):
        """Validate business rules"""
        errors = {}
        
        # Service booking validation
        if self.booking_type == 'servicing':
            if not self.primary_service:
                errors['primary_service'] = "Primary service is required for servicing bookings"
            if self.vehicle_context != 'customer_owned':
                errors['vehicle_context'] = "Service bookings must use customer-owned vehicles"
        
        # Purchase inquiry validation
        if self.booking_type == 'purchase':
            if not self.purchase_details:
                errors['purchase_details'] = "Purchase details are required"
            if self.vehicle_context != 'dealership_vehicle':
                errors['vehicle_context'] = "Purchase inquiries must reference dealership vehicles"
            if self.primary_service:
                errors['primary_service'] = "Services cannot be selected for purchase inquiries"
        
        if errors:
            raise ValidationError(errors)

    def calculate_costs(self):
        """Calculate all cost components"""
        if self.booking_type == 'servicing':
            # Base cost from primary service
            self.base_cost = self.primary_service.cost if self.primary_service else 0
            
            # Recommended services cost
            self.recommended_services_cost = sum(
                service.cost for service in self.recommended_services.all()
            )
            
            # Final cost before tax
            subtotal = self.base_cost + self.recommended_services_cost - self.discount
            self.final_cost = subtotal * (1 + self.tax_rate/100)
        
        elif self.booking_type == 'purchase':
            # Purchase inquiries have no service costs
            self.base_cost = 0
            self.recommended_services_cost = 0
            self.final_cost = None  # Will be determined later in sales process

    def save(self, *args, **kwargs):
        """Auto-calculate costs and validate before saving"""
        self.full_clean()
        self.calculate_costs()
        super().save(*args, **kwargs)

    def get_service_timeline(self):
        """Generate service steps with timestamps"""
        if self.booking_type != 'servicing':
            return None
            
        timeline = []
        if self.primary_service:
            timeline.append({
                'service': self.primary_service.name,
                'estimated_duration': self.primary_service.duration,
                'cost': self.primary_service.cost
            })
        
        for service in self.recommended_services.all():
            timeline.append({
                'service': service.name,
                'estimated_duration': service.duration,
                'cost': service.cost
            })
        
        return timeline

    @property
    def vehicle_details(self):
        """Structured vehicle data for frontend"""
        return {
            'make': self.vehicle.make,
            'model': self.vehicle.model,
            'year': self.vehicle.year,
            'vin': self.vehicle.vin,
            'image': self.vehicle.image.url if self.vehicle.image else None,
            'context': self.get_vehicle_context_display()
        }
    
class VehicleBooking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    date = models.DateField()
    time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    vehicle = models.ForeignKey('Vehicle', on_delete=models.CASCADE, verbose_name="Associated Vehicle")
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Booking for {self.vehicle} on {self.date} at {self.time}"


class UserFavourites(models.Model):
    FAVOURITE_CHOICES = (
        ('service', 'SERVICE'),
        ('vehicle', 'VEHICLE')
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True, blank=True)
    service = models.ForeignKey(Servicing, on_delete=models.CASCADE, null=True, blank=True)
    type = models.CharField(max_length=10, choices=FAVOURITE_CHOICES)

    def save(self, *args, **kwargs):
        print(f" \n data is : \n {self.user} {self.service} {self.vehicle} \n ")
        if self.type == "vehicle" and not self.vehicle:
            raise ValueError("Vehicle must be provided if type is 'vehicle' model ")
        if self.type == "service" and not self.service:
            raise ValueError("Service must be provided if type is 'service' model ")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user} - {self.type}"