from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from django.core.exceptions import ObjectDoesNotExist
from .models import *
from .serializers import *
from rest_framework.exceptions import PermissionDenied
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.core.mail import send_mail, EmailMultiAlternatives
from threading import Thread
from django.conf import settings
from datetime import datetime
import threading


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_permissions(self): 
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]  # Allow anyone to list or retrieve vehicles
        return [permissions.IsAuthenticated()]  # Require authentication for other actions

    def create(self, request, *args, **kwargs):
        try:
            # send_notifcaiton()
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'Failed to create vehicle {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except ObjectDoesNotExist:
            return Response({'error': 'Vehicle not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Failed to update vehicle'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ServicingViewSet(viewsets.ModelViewSet):
    queryset = Servicing.objects.all()
    serializer_class = ServicingSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'Failed to create service {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    queryset = Servicing.objects.all()
    serializer_class = ServicingSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'Failed to create service {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ServiceHistoryViewSet(viewsets.ModelViewSet):
    queryset = ServiceHistory.objects.all()
    serializer_class = ServiceHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            return Response({'error': 'Failed to fetch service history'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class VehicleBookingViewSet(viewsets.ModelViewSet):
#     """
#     A simple ViewSet for viewing and editing vehicle bookings.
#     """
#     queryset = VehicleBooking.objects.all()
#     serializer_class = VehicleBookingSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         """
#         Optionally restricts the returned bookings to the current user.
#         """
#         user = self.request.user
#         return VehicleBooking.objects.filter(user=user)

#     def perform_create(self, serializer):
#         """
#         Override the perform_create method to check that the user is a customer
#         before creating a booking.
#         """
#         user = self.request.user
#         if user.role != 'customer':  # Check if the user is a customer
#             raise PermissionDenied("Only customers can create bookings.")
        
#         # Proceed with saving the booking if the user is a customer
#         serializer.save(user=user)

#async email sending 
def send_booking_email(subject, to_email, template_name, context):
    html_content = render_to_string(template_name, context)

    email = EmailMultiAlternatives(
        subject=subject,
        body=html_content,
        from_email=settings.EMAIL_HOST_USER,
        to=[to_email],
    )
    email.attach_alternative(html_content, "text/html")
    
    # Run email sending in a separate thread
    threading.Thread(target=email.send, kwargs={'fail_silently': False}).start()

class VehicleBookingViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return VehicleBooking.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        if self.request.user.role != 'customer':
            raise PermissionDenied("Only customers can create bookings.")
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='confirm')
    def confirm_booking(self, request, pk=None):
        booking = self.get_object()
        booking.status = 'confirmed'
        booking.save()
        context = {
        'user': booking.user.username,
        'booking': booking,
        'current_year': datetime.now().year,
        'support_link': 'https://yourdomain.com/support'  # Change to your actual link
        }

        send_booking_email(
        subject="Your Booking is Confirmed",
        to_email=booking.user.email,
        template_name="email/customer-templates/booking-confirmation.html",
        context=context
        )
        return Response({'status': 'Booking confirmed'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_booking(self, request, pk=None):
        booking = self.get_object()
        booking.status = 'cancelled'
        booking.save()
        context = {
        'user': booking.user,
        'booking': booking,
        'current_year': datetime.now().year,
        'support_link': 'https://yourdomain.com/support'
        }

        send_booking_email(
        subject="Your Booking has been Cancelled",
        to_email=booking.user.email,
        template_name="email/customer-templates/booking-cancellation.html",
        context=context
    )
        return Response({'status': 'Booking cancelled'}, status=status.HTTP_200_OK)

#class to handel the crud for UserFavourites
class FavouritesViewSet(viewsets.ModelViewSet):
    queryset = UserFavourites.objects.all()
    serializer_class = FavouriteSerilizier
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # users can only view their own favourite
        return UserFavourites.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # user cannot create duplicate favourite
        user = self.request.user
        vehicle = serializer.validated_data.get('vehicle')
        service = serializer.validated_data.get('service')
        type = serializer.validated_data.get('type')

        # if the user already has this vehicle or service as a favourite
        if type == 'vehicle' and vehicle:
            if UserFavourites.objects.filter(user=user, vehicle=vehicle, type=type).exists():
                return Response({'detail': 'Favorite already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        if type == 'service' and service:
            if UserFavourites.objects.filter(user=user, service=service, type=type).exists():
                return Response({'detail': 'Favorite already exists'}, status=status.HTTP_400_BAD_REQUEST)

        #if no duplicates save the data
        serializer.save(user=user)
        
#view to get the total service count for managers
def returnTotalServiceCount(requst):
    service_count = Servicing.objects.all().count()
    return JsonResponse({'service_count': service_count})

def returnTotalAppoitmentCount(request):
    purchase_booking_count = VehicleBooking.objects.filter(status = 'pending').count()
    service_booking_count = 0
    # service_booking_count = VehicleBooking.objects.filter(status = 'pending').count()
    total_booking_count = purchase_booking_count + service_booking_count
    return JsonResponse({'total_bookings_count' : total_booking_count})
