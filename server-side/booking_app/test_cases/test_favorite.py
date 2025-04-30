from django.test import TestCase
from django.contrib.auth import get_user_model
from auth_app.models import Vehicle, Servicing, ServiceCenter
from booking_app.models import Favorite
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from datetime import date, time, datetime
import uuid

User = get_user_model()

class FavoriteTestCase(TestCase):
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

    def test_favorite_missing_user(self):
        try:
            with self.assertRaises(IntegrityError):
                favorite = Favorite(
                    id=uuid.uuid4(),
                    type="service",
                    service=self.service,
                    vehicle=None
                )
                favorite.full_clean()
                favorite.save()
            print("Test Successful: Favorite Missing User Detected")
        except AssertionError as e:
            print("Test Failed: Favorite Missing User Not Detected")
            raise e

    def test_favorite_invalid_type(self):
        try:
            with self.assertRaises(ValidationError):
                favorite = Favorite(
                    id=uuid.uuid4(),
                    user=self.user,
                    type="invalid_type",  # Invalid choice
                    service=self.service,
                    vehicle=None
                )
                favorite.full_clean()
                favorite.save()
            print("Test Successful: Favorite Invalid Type Detected")
        except AssertionError as e:
            print("Test Failed: Favorite Invalid Type Not Detected")
            raise e

    def test_favorite_type_consistency_violation(self):
        try:
            with self.assertRaises(ValidationError):
                favorite = Favorite(
                    id=uuid.uuid4(),
                    user=self.user,
                    type="service",
                    service=None,  # Should not be None for type="service"
                    vehicle=self.vehicle
                )
                favorite.full_clean()
                favorite.save()
            print("Test Successful: Favorite Type Consistency Violation Detected")
        except AssertionError as e:
            print("Test Failed: Favorite Type Consistency Violation Not Detected")
            raise e

    def test_favorite_unique_together_constraint(self):
        try:
            # Create first favorite
            Favorite.objects.create(
                id=uuid.uuid4(),
                user=self.user,
                type="service",
                service=self.service,
                vehicle=None
            )
            # Try to create a duplicate favorite
            with self.assertRaises(IntegrityError):
                favorite = Favorite(
                    id=uuid.uuid4(),
                    user=self.user,
                    type="service",
                    service=self.service,
                    vehicle=None
                )
                favorite.full_clean()
                favorite.save()
            print("Test Successful: Favorite Unique Together Constraint Detected")
        except AssertionError as e:
            print("Test Failed: Favorite Unique Together Constraint Not Detected")
            raise e