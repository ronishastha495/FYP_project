# services/serializers.py
from rest_framework import serializers
from .models import *
from account import models as auth_model

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

# class VehicleBookingSerializer(serializers.ModelSerializer):
#     # Include the vehicle information in the serializer
#     vehicle_name = serializers.CharField(source='vehicle.name', read_only=True)
    
#     class Meta:
#         model = VehicleBooking
#         fields = ['id', 'user', 'vehicle', 'vehicle_name', 'date', 'time', 'status', 'created_at', 'updated_at', 'notes']
#         read_only_fields = ['id', 'created_at', 'updated_at']
    
#     def to_internal_value(self, data):
#         # Print raw incoming data
#         print("\n=== RAW INCOMING DATA ===")
#         print(data)
        
#         try:
#             result = super().to_internal_value(data)
#             # Print parsed data
#             print("\n=== PARSED DATA ===")
#             print(result)
#             return result
#         except Exception as e:
#             print("\n=== PARSING ERROR ===")
#             print(str(e))
#             raise
    
#     def validate_status(self, value):
#         """
#         Ensure status is valid
#         """
#         valid_statuses = ['pending', 'confirmed', 'completed', 'cancelled']
#         if value not in valid_statuses:
#             raise serializers.ValidationError("Invalid status value.")
#         return value
    
class VehicleBookingSerializer(serializers.ModelSerializer):
    vehicle_name = serializers.CharField(source='vehicle.name', read_only=True)
    
    class Meta:
        model = VehicleBooking
        fields = ['id', 'user', 'vehicle', 'vehicle_name', 'date', 'time', 'status', 'created_at', 'updated_at', 'notes']
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']
    
    def create(self, validated_data):
        # Automatically set the user from the request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    

class FavouriteSerilizier(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    year = serializers.SerializerMethodField()
    model = serializers.SerializerMethodField()
    user = serializers.PrimaryKeyRelatedField(queryset=auth_model.User.objects.all())
    vehicle = serializers.PrimaryKeyRelatedField(queryset=Vehicle.objects.all(), allow_null=True  , required=False)
    service = serializers.PrimaryKeyRelatedField(queryset=Servicing.objects.all(), allow_null=True, required=False)
    class Meta:
        model = UserFavourites
        fields = ['id', 'type', 'name', 'description', 'year', 'model', 'user', 'vehicle', 'service']

    def get_name(self, obj):
        # returns the name of the favourite, either a service name or a vehicle make + model
        if isinstance(obj, UserFavourites):
            if obj.type == 'service' and obj.service:
                return obj.service.name
            elif obj.type == 'vehicle' and obj.vehicle:
                return f"{obj.vehicle.make} {obj.vehicle.model}"
        return None

    def get_description(self, obj):
        # the description (only for services)."""
        return obj.service.description if obj.service else None

    def get_year(self, obj):
        # this returns the vehicle year (only for vehicles)
        return obj.vehicle.year if obj.vehicle else None

    def get_model(self, obj):
        # it returns the vehicle model (only for vehicles)
        return obj.vehicle.model if obj.vehicle else None
    def validate(self, data):
        # custom validation to ensure that either vehicle or service is provided based on type
        if data['type'] == "vehicle" and 'vehicle' not in data:
            raise serializers.ValidationError({"vehicle": "This field is required when type is 'vehicle'."})
        if data['type'] == "service" and 'service' not in data:
            raise serializers.ValidationError({"service": "This field is required when type is 'service'."})
        return data