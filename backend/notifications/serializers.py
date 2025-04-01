from rest_framework import serializers
from .models import Notification, OTP

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'title', 'message', 
                 'is_read', 'created_at', 'related_booking']
        read_only_fields = ['created_at']

class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = ['code', 'purpose', 'expires_at']
        read_only_fields = ['expires_at']

class NotificationMarkReadSerializer(serializers.Serializer):
    ids = serializers.ListField(child=serializers.IntegerField())