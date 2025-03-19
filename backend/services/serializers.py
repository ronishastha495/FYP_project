# services/serializers.py
from rest_framework import serializers
from .models import Vehicle, ServiceHistory, Booking, Reminder

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['id', 'user', 'make', 'model', 'year', 'vin']

class ServiceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceHistory
        fields = ['id', 'vehicle', 'service_date', 'service_type', 'cost', 'notes']

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'user', 'vehicle', 'service', 'date', 'time']

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = ['id', 'user', 'message', 'date', 'time']