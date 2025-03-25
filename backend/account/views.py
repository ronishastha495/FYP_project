from rest_framework import generics, status, permissions
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from django.contrib.auth import logout, authenticate
import re
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    RegisterSerializer, LoginSerializer, PasswordResetSerializer, 
    UserSerializer, UserProfileSerializer, UpdateUserProfileSerializer, ChangePasswordSerializer
)
from django.contrib.auth import get_user_model
from .models import UserProfile
import re

User = get_user_model()

#  Register View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role', 'user')  # Default role is 'user'

        #  Validate email format
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
            return Response({'error': 'Invalid email format'}, status=status.HTTP_400_BAD_REQUEST)

        #  Validate password (must contain special character and number)
        if len(password) < 8 or not re.search(r'\d', password) or not re.search(r'[@$!%*?&]', password):
            return Response({'error': 'Password must be at least 8 characters long and contain a number and a special character (@, $, !, %, *, ?, &)'}, status=status.HTTP_400_BAD_REQUEST)

        #  Check if username already exists
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already taken. Please choose another one.'}, status=status.HTTP_400_BAD_REQUEST)

        #  Create user
        user = User.objects.create_user(username=username, email=email, password=password)

        # Ensure UserProfile exists
        user_profile, created = UserProfile.objects.get_or_create(user=user)
        user_profile.role = role
        user_profile.save()

        #  Create JWT tokens (Access and Refresh)
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        return Response({
            'message': 'User registered successfully',
            'access': str(access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_201_CREATED)

#  Login View
class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
            username = request.data.get("username")
            password = request.data.get("password")

            user = authenticate(username=username, password=password)
            if user is None:
                return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

            refresh = RefreshToken.for_user(user)  # Generate JWT tokens

            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "message": "Login successful",
                'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'role': user.role
                    },
                
            }, status=status.HTTP_200_OK)
                    
                
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

class CheckAuthenticationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'authenticated': True,
            'username': request.user.username,
        }, status=status.HTTP_200_OK)

# ✅ Password Reset View (Stub)
class PasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"message": "Password reset email sent"}, status=status.HTTP_200_OK)

# ✅ Change Password View
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

# ✅ User Profile View (Retrieve & Update)
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UpdateUserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

class LogoutView(APIView):
    def post(self, request):
        # Detailed logging for debugging
        logger.info(f"Logout Request Headers: {request.headers}")
        logger.info(f"Logout Request Data: {request.data}")
        logger.info(f"Authentication: {request.user}")
        logger.info(f"Is Authenticated: {request.user.is_authenticated}")

        try:
            # Extract refresh token
            refresh_token = request.data.get('refresh_token')
            
            if not refresh_token:
                logger.error("No refresh token provided")
                return Response(
                    {'error': 'Refresh token is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                # Attempt to blacklist token
                token = RefreshToken(refresh_token)
                token.blacklist()
                
                logger.info("Token successfully blacklisted")
                return Response(
                    {'message': 'Logged out successfully'}, 
                    status=status.HTTP_205_RESET_CONTENT
                )

            except TokenError as token_error:
                logger.error(f"Token Error: {str(token_error)}")
                return Response(
                    {'error': f'Invalid token: {str(token_error)}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            logger.error(f"Unexpected Logout Error: {str(e)}")
            return Response(
                {'error': 'Logout failed', 'details': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Ensure refresh token is in the request
            refresh_token = request.data.get("refresh_token")
            
            if not refresh_token:
                return Response(
                    {'error': 'Refresh token is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Attempt to blacklist the token
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except TokenError as token_error:
                # Handle cases like already blacklisted or invalid token
                return Response(
                    {'error': f'Token error: {str(token_error)}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response(
                {'message': 'Logged out successfully'}, 
                status=status.HTTP_205_RESET_CONTENT
            )

        except Exception as e:
            # Catch any unexpected errors
            return Response(
                {'error': f'Logout failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )