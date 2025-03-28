from rest_framework import generics, status, permissions
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from .models import UserProfile, ServiceManagerProfile
from .serializers import (
    RegisterSerializer, LoginSerializer, PasswordResetSerializer, 
    UserSerializer, UserProfileSerializer, UpdateUserProfileSerializer, 
    ChangePasswordSerializer, ServiceManagerProfileSerializer
)

User = get_user_model()

# ✅ User Registration
class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'User registered successfully',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'profile': {
                    'phone_number': user.phone_number
                }
            },
            'redirect_to': '/manager/' if user.role == 'service_manager' else '/customer/'
        }, status=status.HTTP_201_CREATED)

# ✅ User Login
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            },
            'redirect_to': '/manager/' if user.role == 'service_manager' else '/customer/'
        }, status=status.HTTP_200_OK)

# ✅ Authentication Check
class CheckAuthenticationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'authenticated': True,
            'username': request.user.username,
        }, status=status.HTTP_200_OK)

# ✅ Password Reset
class PasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"message": "Password reset email sent"}, status=status.HTTP_200_OK)

# ✅ Change Password
class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not user.check_password(serializer.validated_data["old_password"]):
            return Response({"error": "Incorrect old password"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

# ✅ User Profile (Retrieve & Update)
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UpdateUserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

# ✅ Service Manager Profile
class ServiceManagerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ServiceManagerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        if self.request.user.role == 'service_manager':
            return self.request.user.service_manager_profile
        raise PermissionDenied("Not a service manager")

# ✅ Logout
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': f'Logout failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
