from django.test import TestCase
from django.contrib.auth import get_user_model
from auth_app.models import ServiceCenter
from datetime import time
import uuid

User = get_user_model()

class ServiceCenterModelTestCase(TestCase):
    def setUp(self):
        self.manager = User.objects.create_user(
            username="manager",
            email="manager@example.com",
            password="managerpass123",
            role="service_manager"
        )

    def test_create_service_center(self):
        try:
            service_center = ServiceCenter.objects.create(
                center_id=uuid.uuid4(),
                name="Test Auto Center",
                description="Test service center",
                location="Test City",
                open_time=time(9, 0),
                close_time=time(17, 0),
                center_manager=self.manager
            )
            result = service_center is not None and service_center.name == "Test Auto Center" and service_center.center_manager == self.manager
            self.assertTrue(result, "Service center creation should succeed")
            print("Test Successful: Service Center Created")
        except Exception as e:
            print(f"Test Failed: Service Center Creation Error - {str(e)}")
            self.fail(f"Service center creation failed: {str(e)}")