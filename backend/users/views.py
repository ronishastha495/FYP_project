from django.shortcuts import render
from django.contrib.auth.models import User 
from .models import Appointment
from .serializer import AppointmentSerializer, UserRegistrationSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        
        try:   
            response = super().post(request, *args, **kwargs)  
            tokens = response.data 

            access_token = tokens['access']
            refresh_token = tokens['refresh']

            res = Response()

            res.data = {'success': True}

            res.set_cookie(
                key='access_token',
                value=access_token,
                secure=True,
                httponly=True,
                samesite='None',
                path='/'
            )

            res.set_cookie(
                key='refresh_token',
                value=refresh_token,
                secure=True,
                httponly=True,
                samesite='None',
                path='/'
            )

            return res
        
        except:
            return Response({'success': False})

class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try: 
            refresh_token = request.COOKIES.get('refresh_token')
            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)

            tokens = response.data
            access_token = tokens['access']

            res = Response()

            res.data = {'refreshed': True}

            res.set_cookie(
                key='access_token',
                value=access_token,
                secure=True,
                httponly=True,
                samesite='None',
                path='/'
            )


            return res

        except:
            return Response({'refreshed': False})

@api_view(['POST'])
def logout(request):
    try:
        res = Response()
        res.data = {'success': True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/', samesite='None')
        return res
    except:
        return Response({'success': False})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    return Response({'authenticated': True})

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'success': True, 'data': serializer.data}, status=201)
    return Response({'success': False, 'errors': serializer.errors}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_appointments(request):
    print(f"Authenticated User: {request.user}")  # Debugging
    user = request.user
    if user.is_anonymous:
        return Response({"error": "User not authenticated"}, status=403)
    appointments = Appointment.objects.filter(customer=user)
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)


# Create your views here.
