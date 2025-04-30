from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import ServiceCenter, Vehicle, Servicing
from datetime import time

User = get_user_model()

class AutoCareTests(APITestCase):

    def setUp(self):
        # Create a service manager
        self.manager = User.objects.create_user(
            username='manager',
            email='manager@example.com',
            password='manager123',
            role='service_manager'
        )

        # Create a customer
        self.customer = User.objects.create_user(
            username='customer',
            email='customer@example.com',
            password='customer123',
            role='customer'
        )

        # Create a service center
        self.service_center = ServiceCenter.objects.create(
            name="AutoFix Center",
            description="Test center",
            location="Kathmandu",
            open_time=time(9, 0),
            close_time=time(17, 0),
            center_manager=self.manager
        )

        self.login_url = reverse('login')  # Ensure this name matches your `urls.py`
        self.register_url = reverse('register')  # Same as above

    def test_user_registration(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123",
            "confirm_password": "password123",
            "role": "customer",
            "phone_number": "123456789",
            "address": "Some Street",
            "city": "City",
            "country": "Country"
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_login(self):
        data = {
            "username": "manager",
            "password": "manager123"
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_add_vehicle_by_manager(self):
        self.client.login(username='manager', password='manager123')
        data = {
            "make": "Toyota",
            "model": "Supra",
            "year": "2021",
            "description": "Sports car",
            "vin": "1HGCM82633A004352",
            "price": 60000.00,
            "discount": 5000.00
        }
        url = reverse('vehicle-create')  # Fixed
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_add_service_by_manager(self):
        self.client.force_authenticate(user=self.manager)
        url = reverse('service-create')  # Fixed
        data = {
            "name": "Engine Check",
            "description": "Full engine diagnostics",
            "cost": 1200.00,
            "discount": 100.00
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_customer_cannot_add_vehicle(self):
        self.client.force_authenticate(user=self.customer)
        url = reverse('vehicle-create')  # Fixed
        data = {
            "make": "Honda",
            "model": "Civic",
            "year": "2020",
            "description": "Compact car",
            "vin": "2HGCM82633A004352",
            "price": 20000.00,
            "discount": 1000.00
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_all_vehicles(self):
        url = reverse('vehicle-list')  # Fixed
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_all_services(self):
        url = reverse('service-list')  # Fixed
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
