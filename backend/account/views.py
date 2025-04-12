from django.http import JsonResponse
from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        response = Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": user.username,
            "role": user.role,
            "message": "Login successful"
        })
        # Set secure cookies for tokens
        response.set_cookie(
            key='access_token',
            value=str(refresh.access_token),
            httponly=True,
            secure=True,
            samesite='Lax',
            max_age=60 * 60  # 1 hour
        )
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=True,
            samesite='Lax',
            max_age=24 * 60 * 60  # 1 day
        )
        print(response)
        return response

class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class PasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # TODO: Implement email sending logic here
        # For now just return success response
        return Response({"message": "Password reset email sent if account exists"})

class ChangePasswordView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        
        if not user.check_password(old_password):
            return Response({"error": "Old password is incorrect"}, status=400)
        
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password updated successfully"})

class CheckAuthenticationView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        print("Received Authorization Header:", request.headers.get("Authorization"))
        return Response({"authenticated": True, "user": request.user.username})


class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # JWT doesn't use auth_token, so just return success
        return Response({"message": "Successfully logged out"})

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UpdateUserProfileSerializer
        return UserProfileSerializer

    def get_object(self):
        return self.request.user


class ServiceManagerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

class UserDetailsView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user

class ProfilePictureUploadView(generics.GenericAPIView):
    parser_classes = [MultiPartParser]
    
    def post(self, request):
        profile = request.user.profile
        file = request.FILES.get('profile_picture')
        
        if file:
            profile.profile_picture = file
            profile.save()
            return Response({'url': profile.profile_picture.url}, status=200)
        
        return Response({'error': 'No file provided'}, status=400)
    
def getUserCount(request):
    customerCount = User.objects.filter(role='customer').count()
    return JsonResponse({'customer_count': customerCount})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMangerNameFromToken(request):
    user = request.user
    username = user.username
    return Response({'username': username})