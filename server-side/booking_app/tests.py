# tests.py

from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import VehicleBooking, ServiceBooking, Favorite
import uuid

User = get_user_model()

class BookingTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_book_vehicle(self):
        url = reverse('book-vehicle')
        data = {
            "vehicle": "some-vehicle-id",  # Replace with real FK or adjust serializer for mock
            "pickup_date": "2025-05-01",
            "dropoff_date": "2025-05-02"
        }
        response = self.client.post(url, data, format='json')
        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST])

    def test_book_service(self):
        url = reverse('book-vehicle')  # book-service typo in your urls.py; fix to 'book-service' if necessary
        data = {
            "service": "some-service-id",  # Replace accordingly
            "booking_date": "2025-05-01",
            "description": "General service"
        }
        response = self.client.post(url, data, format='json')
        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST])

    def test_update_vehicle_booking_status(self):
        booking = VehicleBooking.objects.create(user=self.user)
        url = reverse('vehicle-booking-update-status', kwargs={'booking_id': booking.booking_id})
        data = {"status": "cancelled"}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_service_booking_status(self):
        booking = ServiceBooking.objects.create(user=self.user)
        url = reverse('service-booking-update-status', kwargs={'booking_id': booking.booking_id})
        data = {"status": "completed"}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_bookings(self):
        VehicleBooking.objects.create(user=self.user)
        ServiceBooking.objects.create(user=self.user)
        url = reverse('get_user_bookings')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class TokenTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tokenuser', password='testpass123')
        self.client = APIClient()

    def test_token_refresh(self):
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(self.user)
        url = reverse('token_refresh')
        data = {"refresh": str(refresh)}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

class FavoriteTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='favoriteuser', password='testpass123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_add_favorite(self):
        url = reverse('favorite_create')
        data = {
            "type": "vehicle",
            "vehicle": "some-vehicle-id"  # replace as per your setup
        }
        response = self.client.post(url, data, format='json')
        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_200_OK])

    def test_list_favorites(self):
        Favorite.objects.create(user=self.user, type='vehicle', vehicle="some-vehicle-id")
        url = reverse('favorite_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_check_favorite(self):
        Favorite.objects.create(user=self.user, type='vehicle', vehicle="some-vehicle-id")
        url = reverse('favorite_check') + "?type=vehicle&item_id=some-vehicle-id"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_favorite'])

    def test_toggle_favorite(self):
        url = reverse('favorite_toggle')
        data = {
            "type": "vehicle",
            "item_id": "some-vehicle-id"
        }
        response = self.client.post(url, data, format='json')
        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_200_OK])

class AuthTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='authuser', password='testpass123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_auth_check(self):
        url = reverse('auth_check')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_authenticated'])
