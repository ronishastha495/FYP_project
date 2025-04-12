from rest_framework import serializers
from .models import UserAnalytics, AdminTracking, Rating
from services.serializers import VehicleBookingSerializer

class UserAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnalytics
        fields = ['total_spent', 'services_completed', 
                 'last_service_date', 'average_rating']

class AdminTrackingSerializer(serializers.ModelSerializer):
    admin = serializers.StringRelatedField()
    
    class Meta:
        model = AdminTracking
        fields = ['admin', 'action', 'model', 'timestamp', 'details']

class RatingSerializer(serializers.ModelSerializer):
    booking = VehicleBookingSerializer(read_only=True)
    
    class Meta:
        model = Rating
        fields = ['booking', 'rating', 'review', 'created_at']
        read_only_fields = ['created_at']

class DashboardFilterSerializer(serializers.Serializer):
    date_from = serializers.DateField(required=False)
    date_to = serializers.DateField(required=False)
    service_type = serializers.CharField(required=False)
    status = serializers.CharField(required=False)