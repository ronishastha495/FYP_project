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

class VehicleBookingViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return bookings that belong only to the logged-in user"""
        return VehicleBooking.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        """Pass the request to the serializer context"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        """only customers can create bookings"""
        if self.request.user.role != 'customer':
            raise PermissionDenied("Only customers can create bookings.")
        serializer.save(user=self.request.user)  # Explicitly set user

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