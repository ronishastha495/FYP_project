# services/serializers.py
from rest_framework import serializers
from .models import Vehicle, Servicing, ServiceHistory, Booking

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'
        read_only_fields = ('id',)

class ServicingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicing
        fields = '__all__'
        read_only_fields = ('id',)

class ServiceHistorySerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(read_only=True)
    
    class Meta:
        model = ServiceHistory
        fields = '__all__'
        read_only_fields = ('id',)

class BookingSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(read_only=True)
    primary_service = ServicingSerializer(read_only=True)
    recommended_services = ServicingSerializer(many=True, read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'final_cost')

    def validate(self, data):
        if data.get('booking_type') == 'servicing' and not data.get('primary_service'):
            raise serializers.ValidationError("Primary service is required for servicing bookings")
        if data.get('booking_type') == 'purchase' and not data.get('purchase_details'):
            raise serializers.ValidationError("Purchase details are required for purchase inquiries")
        
        # Validate vehicle context based on booking type
        if data.get('booking_type') == 'servicing' and data.get('vehicle_context') != 'customer_owned':
            raise serializers.ValidationError("Service bookings must use customer-owned vehicles")
        if data.get('booking_type') == 'purchase' and data.get('vehicle_context') != 'dealership_vehicle':
            raise serializers.ValidationError("Purchase inquiries must reference dealership vehicles")
            
        return data
        
    def create(self, validated_data):
        # Handle recommended_services separately as it's a many-to-many field
        recommended_services = validated_data.pop('recommended_services', [])
        booking = Booking.objects.create(**validated_data)
        booking.recommended_services.set(recommended_services)
        return booking

