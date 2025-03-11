from django.contrib.auth.models import User
from .serializers import UserRegistrationSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer, ChangePasswordSerializer
from rest_framework import generics, status
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data 

            access_token = tokens['access']
            refresh_token = tokens['refresh']

            res = Response({'success': True})
            res.set_cookie('access_token', access_token, secure=True, httponly=True, samesite='None', path='/')
            res.set_cookie('refresh_token', refresh_token, secure=True, httponly=True, samesite='None', path='/')

            return res
        except:
            return Response({'success': False}, status=400)

class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if not refresh_token:
                return Response({'refreshed': False}, status=400)

            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)
            access_token = response.data['access']

            res = Response({'refreshed': True})
            res.set_cookie('access_token', access_token, secure=True, httponly=True, samesite='None', path='/')

            return res
        except:
            return Response({'refreshed': False}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=400)

        token = RefreshToken(refresh_token)
        token.blacklist()  # Blacklist the refresh token

        res = Response({"message": "Logged out successfully"}, status=200)
        res.delete_cookie('access_token')
        res.delete_cookie('refresh_token')

        return res
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    return Response({"authenticated": True}, status=200)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'success': True, 'data': serializer.data}, status=201)
    return Response({'success': False, 'errors': serializer.errors}, status=400)

# Password Reset Request View
class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        # Generate a unique token (for demonstration purposes)
        token = get_random_string(length=32)

        # Save the token in the database (you would typically use a model for this)
        # For simplicity, assume the token is saved and linked to the user.

        # Send reset link via email
        send_mail(
            'Password Reset Request',
            f'Use this link to reset your password: http://127.0.0.1:8000/users/reset-password/{token}/',
            'admin@example.com',
            [email],
            fail_silently=False,
        )

        return Response({'detail': 'Password reset link sent.'}, status=status.HTTP_200_OK)

# Password Reset Confirm View
class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request, token, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_password = serializer.validated_data['new_password']

        # Retrieve user associated with the token (simplified for demonstration)
        user = User.objects.filter(password_reset_token=token).first()
        if not user:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({'detail': 'Password has been reset.'}, status=status.HTTP_200_OK)

class ChangePasswordView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']

        if not request.user.check_password(old_password):
            return Response({'error': 'Incorrect old password'}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(new_password)
        request.user.save()

        return Response({'detail': 'Password updated successfully'}, status=status.HTTP_200_OK)