from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .serializers import RegisterUserSerializer, LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

class RegisterUserView(APIView):
    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            try:
                refresh = RefreshToken.for_user(user)
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "id": getattr(user, "id", None),
                    "user": getattr(user, "username", ""),
                    "role": getattr(user, "role", "customer"),
                    "phone_number": getattr(user, "phone_number", ""),
                    "address": getattr(user, "address", ""),
                    "city": getattr(user, "city", ""),
                    "country": getattr(user, "country", "")
                }, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": f"Token generation failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AuthenticatedCheckView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "is_authenticated": True,
            "user": {
                "id": user.id,
                "username": user.username,
                "role": getattr(user, "role", "customer"),
                "phone_number": getattr(user, "phone_number", ""),
                "address": getattr(user, "address", ""),
                "city": getattr(user, "city", ""),
                "country": getattr(user, "country", "")
            }
        }, status=status.HTTP_200_OK)
