from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Appointment
from .serializer import AppointmentSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_appointments(request):
    user = request.user
    appointments = Appointment.objects.filter(customer=user)
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)


# Create your views here.
