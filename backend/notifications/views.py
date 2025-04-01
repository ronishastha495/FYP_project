from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import Notification, OTP
from .serializers import NotificationSerializer, OTPSerializer, NotificationMarkReadSerializer
from django.utils import timezone
from django.core.exceptions import ValidationError
import pyotp
import datetime

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=False, methods=['post'])
    def mark_read(self, request):
        serializer = NotificationMarkReadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        Notification.objects.filter(
            id__in=serializer.validated_data['ids'],
            user=request.user
        ).update(is_read=True)
        
        return Response({'status': 'marked as read'})

class OTPViewSet(viewsets.GenericViewSet):
    queryset = OTP.objects.all()
    serializer_class = OTPSerializer

    @action(detail=False, methods=['post'])
    def generate(self, request):
        # Generate OTP logic
        totp = pyotp.TOTP(pyotp.random_base32(), digits=6)
        code = totp.now()
        expires_at = timezone.now() + datetime.timedelta(minutes=5)
        
        OTP.objects.create(
            user=request.user,
            code=code,
            purpose=request.data.get('purpose', 'verification'),
            expires_at=expires_at
        )
        
        # In production: Send via SMS/Email
        return Response({'code': code, 'expires_at': expires_at})

    @action(detail=False, methods=['post'])
    def verify(self, request):
        code = request.data.get('code')
        purpose = request.data.get('purpose', 'verification')
        
        try:
            otp = OTP.objects.get(
                user=request.user,
                code=code,
                purpose=purpose,
                is_used=False
            )
            
            if not otp.is_valid():
                raise ValidationError("OTP expired or invalid")
            
            otp.is_used = True
            otp.save()
            return Response({'status': 'verified'})
            
        except (OTP.DoesNotExist, ValidationError) as e:
            return Response({'error': str(e)}, status=400)