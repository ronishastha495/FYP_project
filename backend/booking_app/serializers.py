from decimal import Decimal
from rest_framework import serializers
from .models import VehicleBooking, ServiceBooking, Favorite
from auth_app.models import Vehicle, Servicing

class VehicleBookingSerializer(serializers.ModelSerializer):
    vehicle = serializers.PrimaryKeyRelatedField(
        queryset=Vehicle.objects.all(),
        error_messages={
            'does_not_exist': 'Requested Vehicle was not found.',
            'invalid': 'Invalid vehicle ID.'
        }
    )

    class Meta:
        model = VehicleBooking
        fields = ['booking_id', 'vehicle', 'date', 'time', 'notes', 'total_price']
        read_only_fields = ['booking_id', 'total_price']

    def validate(self, data):
        vehicle = data['vehicle']
        discount = Decimal(vehicle.discount) / Decimal(100)
        discounted_price = vehicle.price * (Decimal(1) - discount)
        data['total_price'] = round(discounted_price, 2)
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        return VehicleBooking.objects.create(user=user, **validated_data)

    
class ServicingBookingSerializer(serializers.ModelSerializer):
    service = serializers.PrimaryKeyRelatedField(
        queryset=Servicing.objects.all(),
        error_messages={
            'does_not_exist': 'Requested Service not found.',
            'invalid': 'Invalid service ID.'
        }
    )

    class Meta:
        model = ServiceBooking
        fields = ['booking_id', 'date', 'time', 'notes', 'service', 'total_price']
        read_only_fields = ['booking_id', 'total_price']

    def validate(self, data):
        service = data['service']
        discount = service.discount / Decimal(100)
        discounted_price = service.cost * (Decimal(1) - discount)
        data['total_price'] = round(discounted_price, 2)
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        return ServiceBooking.objects.create(user=user, **validated_data)
    
class VehicleBookingStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleBooking
        fields = ['booking_id', 'status']

    def validate_status(self, value):
        if value not in ['confirmed', 'cancelled']:
            raise serializers.ValidationError("Status can only be 'confirmed' or 'cancelled'.")
        return value

    def validate(self, data):
        booking = self.instance
        if booking.status != 'pending':
            raise serializers.ValidationError("Only pending bookings can be confirmed or cancelled.")
        return data

class ServiceBookingStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceBooking
        fields = ['booking_id', 'status']

    def validate_status(self, value):
        if value not in ['confirmed', 'cancelled']:
            raise serializers.ValidationError("Status can only be 'confirmed' or 'cancelled'.")
        return value

    def validate(self, data):
        booking = self.instance  # This will be set in the view
        if booking.status != 'pending':
            raise serializers.ValidationError("Only pending bookings can be confirmed or cancelled.")
        return data

class GetUserBookingsSerializer(serializers.Serializer):
    booking_id = serializers.UUIDField()
    date = serializers.DateField()
    time = serializers.TimeField()
    status = serializers.CharField()
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    notes = serializers.CharField(allow_blank=True, allow_null=True)
    type = serializers.CharField()
    created_at = serializers.DateTimeField()
    vehicle = serializers.SerializerMethodField()
    service = serializers.SerializerMethodField()

    def get_vehicle(self, obj):
        if isinstance(obj, VehicleBooking) and obj.vehicle:
            return {
                "vehicle_id": str(obj.vehicle.vehicle_id),
                "make": obj.vehicle.make,
                "model": obj.vehicle.model,
                "year": obj.vehicle.year,
                "price": obj.vehicle.price,
                "image": obj.vehicle.image.url if obj.vehicle.image else None,
            }
        return None

    def get_service(self, obj):
        if isinstance(obj, ServiceBooking) and obj.service:
            return {
                "service_id": str(obj.service.service_id),
                "name": obj.service.name,
                "description": obj.service.description,
                "cost": obj.service.cost,
                "image": obj.service.image.url if obj.service.image else None,
            }
        return None


class FavoriteSerializer(serializers.ModelSerializer):
    service_details = serializers.SerializerMethodField(read_only=True)
    vehicle_details = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'user', 'type', 'service', 'vehicle', 'created_at', 'service_details', 'vehicle_details']
        read_only_fields = ['id', 'created_at']
    
    def get_service_details(self, obj):
        if obj.type == 'service' and obj.service:
            return {
                "service_id": str(obj.service.service_id),
                "name": obj.service.name,
                "description": obj.service.description,
                "cost": obj.service.cost,
                "image": obj.service.image.url if obj.service.image else None,
                "discount": obj.service.discount,
                "provided_by": obj.service.provided_by.name
            }
        return None
    
    def get_vehicle_details(self, obj):
        if obj.type == 'vehicle' and obj.vehicle:
            return {
                "vehicle_id": str(obj.vehicle.vehicle_id),
                "make": obj.vehicle.make,
                "model": obj.vehicle.model,
                "year": obj.vehicle.year,
                "price": obj.vehicle.price,
                "discount": obj.vehicle.discount,
                "image": obj.vehicle.image.url if obj.vehicle.image else None,
                "sold_by": obj.vehicle.sold_by.name
            }
        return None
        
    def validate(self, data):
        # Ensure type consistency with the provided data
        if data.get('type') == 'service' and not data.get('service'):
            raise serializers.ValidationError("Service ID is required for service favorites")
        elif data.get('type') == 'vehicle' and not data.get('vehicle'):
            raise serializers.ValidationError("Vehicle ID is required for vehicle favorites")
            
        # Ensure the other field is None based on type
        if data.get('type') == 'service':
            data['vehicle'] = None
        elif data.get('type') == 'vehicle':
            data['service'] = None
            
        return data
        
    def create(self, validated_data):
        # Set the user from the request context
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
