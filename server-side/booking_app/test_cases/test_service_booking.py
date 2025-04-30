from django.test import TestCase
from django.contrib.auth import get_user_model
from auth_app.models import Servicing, ServiceCenter
from booking_app.models import ServiceBooking
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from datetime import date, time, datetime
import uuid

User = get_user_model()

class ServiceBookingTestCase(TestCase):
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
        self.service = Servicing.objects.create(
            service_id=uuid.uuid4(),
            name="Engine Check",
            description="Full engine diagnostics",
            cost=1200.00,
            discount=100.00,
            provided_by=self.service_center
        )

    def test_create_service_booking(self):
        try:
            booking = ServiceBooking.objects.create(
                booking_id=uuid.uuid4(),
                user=self.user,
                status="pending",
                date=date(2025, 5, 1),
                time=time(10, 0),
                service=self.service,
                total_price=1100.00,
                notes="Please check the engine thoroughly."
            )
            self.assertIsNotNone(booking)
            self.assertEqual(booking.user, self.user)
            self.assertEqual(booking.service, self.service)
            self.assertEqual(booking.status, "pending")
            print("Test Successful: Service Booking Created")
        except Exception as e:
            print(f"Test Failed: Service Booking Creation Error - {str(e)}")
            self.fail(f"Service booking creation failed: {str(e)}")

    def test_service_booking_str_method(self):
        try:
            booking = ServiceBooking.objects.create(
                booking_id=uuid.uuid4(),
                user=self.user,
                status="confirmed",
                date=date(2025, 5, 1),
                time=time(10, 0),
                service=self.service,
                total_price=1100.00
            )
            expected_str = f"Service booking for {self.user.username} on {booking.date} at {booking.time}"
            self.assertEqual(str(booking), expected_str)
            print("Test Successful: Service Booking String Method Verified")
        except Exception as e:
            print(f"Test Failed: Service Booking String Method Error - {str(e)}")
            self.fail(f"Service booking string method failed: {str(e)}")

    def test_service_booking_missing_date(self):
        try:
            with self.assertRaises(ValidationError):
                booking = ServiceBooking(
                    booking_id=uuid.uuid4(),
                    user=self.user,
                    status="pending",
                    time=time(10, 0),
                    service=self.service,
                    total_price=1100.00
                )
                booking.full_clean()
                booking.save()
            print("Test Successful: Service Booking Missing Date Detected")
        except AssertionError as e:
            print("Test Failed: Service Booking Missing Date Not Detected")
            raise e

    def test_service_booking_missing_time(self):
        try:
            with self.assertRaises(ValidationError):
                booking = ServiceBooking(
                    booking_id=uuid.uuid4(),
                    user=self.user,
                    status="pending",
                    date=date(2025, 5, 1),
                    service=self.service,
                    total_price=1100.00
                )
                booking.full_clean()
                booking.save()
            print("Test Successful: Service Booking Missing Time Detected")
        except AssertionError as e:
            print("Test Failed: Service Booking Missing Time Not Detected")
            raise e

    def test_service_booking_invalid_status(self):
        try:
            with self.assertRaises(ValidationError):
                booking = ServiceBooking(
                    booking_id=uuid.uuid4(),
                    user=self.user,
                    status="invalid_status",  # Invalid choice
                    date=date(2025, 5, 1),
                    time=time(10, 0),
                    service=self.service,
                    total_price=1100.00
                )
                booking.full_clean()
                booking.save()
            print("Test Successful: Service Booking Invalid Status Detected")
        except AssertionError as e:
            print("Test Failed: Service Booking Invalid Status Not Detected")
            raise e