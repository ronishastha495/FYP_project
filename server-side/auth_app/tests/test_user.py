from django.test import TestCase
from django.contrib.auth import get_user_model
from django.conf import settings
from auth_app.models import User

User = get_user_model()

class UserModelTestCase(TestCase):
    def test_create_customer_user(self):
        try:
            user = User.objects.create_user(
                username="testcustomer",
                email="customer@example.com",
                password="testpass123",
                role="customer",
                phone_number="1234567890",
                address="123 Test St",
                city="Test City",
                country="Test Country"
            )
            result = user is not None and user.role == "customer" and user.check_password("testpass123")
            self.assertTrue(result, "Customer user creation should succeed")
            print("Test Successful: Customer User Created")
        except Exception as e:
            print(f"Test Failed: Customer User Creation Error - {str(e)}")
            self.fail(f"Customer user creation failed: {str(e)}")

    def test_create_service_manager_user(self):
        try:
            user = User.objects.create_user(
                username="testmanager",
                email="manager@example.com",
                password="managerpass123",
                role="service_manager"
            )
            result = user is not None and user.role == "service_manager" and user.check_password("managerpass123")
            self.assertTrue(result, "Service manager user creation should succeed")
            print("Test Successful: Service Manager User Created")
        except Exception as e:
            print(f"Test Failed: Service Manager User Creation Error - {str(e)}")
            self.fail(f"Service manager user creation failed: {str(e)}")