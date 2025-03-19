# services/views.py
from rest_framework import generics, permissions
from .models import Vehicle, ServiceHistory, Booking, Reminder
from .serializers import VehicleSerializer, ServiceHistorySerializer, BookingSerializer, ReminderSerializer

# Vehicle Views
class VehicleListView(generics.ListCreateAPIView):
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Vehicle.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class VehicleDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Vehicle.objects.filter(user=self.request.user)

# Service History Views
class ServiceHistoryListView(generics.ListCreateAPIView):
    serializer_class = ServiceHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ServiceHistory.objects.filter(vehicle__user=self.request.user)

    def perform_create(self, serializer):
        vehicle = serializer.validated_data['vehicle']
        if vehicle.user != self.request.user:
            raise permissions.PermissionDenied("You do not own this vehicle.")
        serializer.save()

class ServiceHistoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ServiceHistory.objects.filter(vehicle__user=self.request.user)

# Booking Views
class BookingListView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

# Reminder Views
class ReminderListView(generics.ListCreateAPIView):
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReminderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)