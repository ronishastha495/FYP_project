from django.test import TestCase
from django.contrib.auth import get_user_model
from auth_app.models import Vehicle, Servicing, ServiceCenter
from booking_app.models import Favorite
from django.db import IntegrityError
from django.core.exceptions import ValidationError
import uuid

User = get_user_model()

class FavoriteConstraintsTestCase(TestCase):
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