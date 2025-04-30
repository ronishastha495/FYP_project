from django.test import TestCase
from django.contrib.auth import get_user_model
from auth_app.models import Vehicle, ServiceCenter
from booking_app.models import VehicleBooking
from django.core.exceptions import ValidationError
from datetime import date, time
import uuid

User = get_user_model()

class VehicleBookingValidationTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="user@example.com",
            password="userpass123",
            role="customer"
        )
        self.manager = User.objects.create_user(
            username="manager",
            email="manager@example.com",
            password="managerpass123",
            role="service_manager"
        )
        self.service_center = ServiceCenter.objects.create(
            center_id=uuid.uuid4(),
            name="Test Auto Center",
            description="Test service center",
            location="Test City",
            open_time=time(9, 0),
            close_time=time(17, 0),
            center_manager=self.manager
        )
        self.vehicle = Vehicle.objects.create(
            vehicle_id=uuid.uuid4(),
            make="Toyota",
            model="Supra",
            year="2021",
            vin="1HGCM82633A004352",
            description="Sports car",
            price=60000.00,
            discount=5000.00,
            sold_by=self.service_center
        )

    def test_vehicle_booking_missing_date(self):
        try:
            with self.assertRaises(ValidationError):
                booking = VehicleBooking(
                    booking_id=uuid.uuid4(),
                    user=self.user,
                    status="pending",
                    time=time(10, 0),
                    vehicle=self.vehicle,
                    total_price=55000.00
                )
                booking.full_clean()
                booking.save()
            print("Test Successful: Vehicle Booking Missing Date Detected")
        except AssertionError as e:
            print("Test Failed: Vehicle Booking Missing Date Not Detected")
            raise e

    def test_vehicle_booking_missing_time(self):
        try:
            with self.assertRaises(ValidationError):
                booking = VehicleBooking(
                    booking_id=uuid.uuid4(),
                    user=self.user,
                    status="pending",
                    date=date(2025, 5, 1),
                    vehicle=self.vehicle,
                    total_price=55000.00
                )
                booking.full_clean()
                booking.save()
            print("Test Successful: Vehicle Booking Missing Time Detected")
        except AssertionError as e:
            print("Test Failed: Vehicle Booking Missing Time Not Detected")
            raise e

    def test_vehicle_booking_invalid_status(self):
        try:
            with self.assertRaises(ValidationError):
                booking = VehicleBooking(
                    booking_id=uuid.uuid4(),
                    user=self.user,
                    status="invalid_status",  # Invalid choice
                    date=date(2025, 5, 1),
                    time=time(10, 0),
                    vehicle=self.vehicle,
                    total_price=55000.00
                )
                booking.full_clean()
                booking.save()
            print("Test Successful: Vehicle Booking Invalid Status Detected")
        except AssertionError as e:
            print("Test Failed: Vehicle Booking Invalid Status Not Detected")
            raise e