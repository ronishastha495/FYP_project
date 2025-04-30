from django.test import TestCase
from django.contrib.auth import get_user_model
from auth_app.models import ServiceCenter, Servicing
from datetime import time
import uuid

User = get_user_model()

class ServicingModelTestCase(TestCase):
    def setUp(self):
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

    def test_create_servicing(self):
        servicing = Servicing.objects.create(
            service_id=uuid.uuid4(),
            name="Engine Check",
            description="Full engine diagnostics",
            cost=1200.00,
            discount=100.00,
            provided_by=self.service_center
        )
        self.assertIsNotNone(servicing)
        self.assertEqual(servicing.name, "Engine Check")
        self.assertEqual(servicing.provided_by, self.service_center)

    def test_servicing_str_method(self):
        servicing = Servicing.objects.create(
            service_id=uuid.uuid4(),
            name="Oil Change",
            description="Standard oil change service",
            cost=500.00,
            discount=50.00,
            provided_by=self.service_center
        )
        expected_str = f"{servicing.name} by {self.service_center.name}"
        self.assertEqual(str(servicing), expected_str)

    def test_servicing_missing_required_fields(self):
        with self.assertRaises(Exception):
            Servicing.objects.create(
                service_id=uuid.uuid4(),
                # name is missing
                description="Missing name field",
                cost=300.00,
                discount=0.00,
                provided_by=self.service_center
        )
    print("Test Successful: Servicing Missing Required Fields Detected")
    # Since the test failed, the print statement for failure would be:
    print("Test Failed: Servicing Missing Required Fields Not Detected")

    def test_servicing_invalid_cost(self):
        with self.assertRaises(Exception):
            Servicing.objects.create(
                service_id=uuid.uuid4(),
                name="Invalid Cost Service",
                description="Cost is negative",
                cost=-100.00,  # invalid negative cost
                discount=0.00,
                provided_by=self.service_center
            )
