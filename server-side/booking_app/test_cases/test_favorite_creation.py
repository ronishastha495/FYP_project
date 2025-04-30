from django.test import TestCase
from django.contrib.auth import get_user_model
from auth_app.models import Vehicle, Servicing, ServiceCenter
from booking_app.models import Favorite
import uuid

User = get_user_model()

class FavoriteCreationTestCase(TestCase):
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

    def test_create_service_favorite(self):
        try:
            favorite = Favorite.objects.create(
                id=uuid.uuid4(),
                user=self.user,
                type="service",
                service=self.service,
                vehicle=None
            )
            self.assertIsNotNone(favorite)
            self.assertEqual(favorite.user, self.user)
            self.assertEqual(favorite.type, "service")
            self.assertEqual(favorite.service, self.service)
            self.assertIsNone(favorite.vehicle)
            print("Test Successful: Service Favorite Created")
        except Exception as e:
            print(f"Test Failed: Service Favorite Creation Error - {str(e)}")
            self.fail(f"Service favorite creation failed: {str(e)}")

    def test_create_vehicle_favorite(self):
        try:
            favorite = Favorite.objects.create(
                id=uuid.uuid4(),
                user=self.user,
                type="vehicle",
                vehicle=self.vehicle,
                service=None
            )
            self.assertIsNotNone(favorite)
            self.assertEqual(favorite.user, self.user)
            self.assertEqual(favorite.type, "vehicle")
            self.assertEqual(favorite.vehicle, self.vehicle)
            self.assertIsNone(favorite.service)
            print("Test Successful: Vehicle Favorite Created")
        except Exception as e:
            print(f"Test Failed: Vehicle Favorite Creation Error - {str(e)}")
            self.fail(f"Vehicle favorite creation failed: {str(e)}")