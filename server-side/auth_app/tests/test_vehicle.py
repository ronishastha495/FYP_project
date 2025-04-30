from django.test import TestCase
from django.contrib.auth import get_user_model
from auth_app.models import ServiceCenter, Vehicle  # Changed from authentication_app.models to auth_app.models
from datetime import time
import uuid

User = get_user_model()

class VehicleModelTestCase(TestCase):
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

    def test_create_vehicle(self):
        try:
            vehicle = Vehicle.objects.create(
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
            result = vehicle is not None and vehicle.make == "Toyota" and vehicle.sold_by == self.service_center
            self.assertTrue(result, "Vehicle creation should succeed")
            print("Test Successful: Vehicle Created")
        except Exception as e:
            print(f"Test Failed: Vehicle Creation Error - {str(e)}")
            self.fail(f"Vehicle creation failed: {str(e)}")