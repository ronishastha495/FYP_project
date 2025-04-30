from django.test import TestCase
from django.contrib.auth import get_user_model
from auth_app.models import Vehicle, Servicing, ServiceCenter
from booking_app.models import Favorite
import uuid

User = get_user_model()

class FavoriteStrTestCase(TestCase):
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
        self.service = Servicing.objects.create(
            service_id=uuid.uuid4(),
            name="Engine Check",
            description="Full engine diagnostics",
            cost=1200.00,
            discount=100.00,
            provided_by=self.service_center
        )

    def test_favorite_str_method_service(self):
        try:
            favorite = Favorite.objects.create(
                id=uuid.uuid4(),
                user=self.user,
                type="service",
                service=self.service,
                vehicle=None
            )
            expected_str = f"{self.user.username}'s favorite service: {self.service.name}"
            self.assertEqual(str(favorite), expected_str)
            print("Test Successful: Favorite Service String Method Verified")
        except Exception as e:
            print(f"Test Failed: Favorite Service String Method Error - {str(e)}")
            self.fail(f"Favorite service string method failed: {str(e)}")

    def test_favorite_str_method_vehicle(self):
        try:
            favorite = Favorite.objects.create(
                id=uuid.uuid4(),
                user=self.user,
                type="vehicle",
                vehicle=self.vehicle,
                service=None
            )
            expected_str = f"{self.user.username}'s favorite vehicle: {self.vehicle.make} {self.vehicle.model}"
            self.assertEqual(str(favorite), expected_str)
            print("Test Successful: Favorite Vehicle String Method Verified")
        except Exception as e:
            print(f"Test Failed: Favorite Vehicle String Method Error - {str(e)}")
            self.fail(f"Favorite vehicle string method failed: {str(e)}")