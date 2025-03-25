# services/views.py
from rest_framework import viewsets
from rest_framework import permissions
from .models import Vehicle, Servicing, ServiceHistory, Booking, Reminder, Notification
from .serializers import VehicleSerializer, ServicingSerializer, ServiceHistorySerializer, BookingSerializer, ReminderSerializer, NotificationSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [permissions.AllowAny]

class ServicingViewSet(viewsets.ModelViewSet):
    queryset = Servicing.objects.all()
    serializer_class = ServicingSerializer
    permission_classes = [permissions.AllowAny]

class ServiceHistoryViewSet(viewsets.ModelViewSet):
    queryset = ServiceHistory.objects.all()
    serializer_class = ServiceHistorySerializer
    permission_classes = [permissions.AllowAny]

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.AllowAny]

class ReminderViewSet(viewsets.ModelViewSet):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer
    permission_classes = [permissions.AllowAny]

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.AllowAny]