from django.test import TestCase
from django.contrib.auth import get_user_model
from auth_app.models import Servicing, ServiceCenter
from booking_app.models import ServiceBooking
from datetime import date, time
import uuid

User = get_user_model()

class ServiceBookingStrTestCase(TestCase):
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