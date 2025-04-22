from rest_framework import generics
from .models import VehicleBooking, ServiceBooking, Favorite
from .serializers import *
from .permissions import IsCustomer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status as http_status
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from itertools import chain
from operator import attrgetter
from django.db.models import Q


class BookVehicleAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    def post(self, request, *args, **kwargs):
        serializer = VehicleBookingSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            booking = serializer.save()
            return Response({
                "message": "Vehicle booked successfully!",
                "data": VehicleBookingSerializer(booking).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateVehicleBookingStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, booking_id):
        try:
            booking = VehicleBooking.objects.get(booking_id=booking_id, user=request.user)
        except VehicleBooking.DoesNotExist:
            return Response({"error": "Booking not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = VehicleBookingStatusUpdateSerializer(booking, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": f"Vehicle booking status updated to {serializer.validated_data['status']}.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookServiceAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    def post(self, request, *args, **kwargs):
        serializer = ServicingBookingSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            booking = serializer.save()
            return Response({
                "message": "Servicing booked successfully!",
                "data": ServicingBookingSerializer(booking, context={'request': request}).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateServiceBookingStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, booking_id):
        try:
            booking = ServiceBooking.objects.get(booking_id=booking_id, user=request.user)
        except ServiceBooking.DoesNotExist:
            return Response({"error": "Booking not found."}, status=http_status.HTTP_404_NOT_FOUND)

        serializer = ServiceBookingStatusUpdateSerializer(booking, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": f"Service booking status updated to {serializer.validated_data.get('status', 'unknown')}.",
                "data": serializer.data
            }, status=http_status.HTTP_200_OK)

        return Response(serializer.errors, status=http_status.HTTP_400_BAD_REQUEST)
    
#fetch user's booking weather it is service or vehicel
class GetUserBookings(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        vehicle_bookings = VehicleBooking.objects.filter(user=user)
        service_bookings = ServiceBooking.objects.filter(user=user)

        # Add type field manually
        for vb in vehicle_bookings:
            vb.type = "Vehicle Purchase"
        for sb in service_bookings:
            sb.type = "Vehicle Service Booking"

        # Combine both querysets
        combined = sorted(
            chain(vehicle_bookings, service_bookings),
            key=attrgetter('created_at'),
            reverse=True
        )

        serializer = GetUserBookingsSerializer(combined, many=True)
        return Response(serializer.data)


# Favorites Views
class FavoriteListView(APIView):
    """View to list all favorites for the current user"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)


class FavoriteCreateView(APIView):
    """View to create a new favorite"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = FavoriteSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            # Check if favorite already exists
            favorite_type = serializer.validated_data.get('type')
            if favorite_type == 'service':
                service = serializer.validated_data.get('service')
                existing = Favorite.objects.filter(user=request.user, type='service', service=service).first()
            else:  # vehicle
                vehicle = serializer.validated_data.get('vehicle')
                existing = Favorite.objects.filter(user=request.user, type='vehicle', vehicle=vehicle).first()
                
            if existing:
                return Response({
                    "message": "Item is already in favorites",
                    "data": FavoriteSerializer(existing).data
                }, status=status.HTTP_200_OK)
                
            favorite = serializer.save()
            return Response({
                "message": "Added to favorites successfully",
                "data": FavoriteSerializer(favorite).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FavoriteDetailView(APIView):
    """View to retrieve, update or delete a favorite"""
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk):
        try:
            return Favorite.objects.get(pk=pk, user=self.request.user)
        except Favorite.DoesNotExist:
            return None
    
    def get(self, request, pk):
        favorite = self.get_object(pk)
        if not favorite:
            return Response({"error": "Favorite not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = FavoriteSerializer(favorite)
        return Response(serializer.data)
    
    def delete(self, request, pk):
        favorite = self.get_object(pk)
        if not favorite:
            return Response({"error": "Favorite not found"}, status=status.HTTP_404_NOT_FOUND)
        favorite.delete()
        return Response({"message": "Favorite removed successfully"}, status=status.HTTP_204_NO_CONTENT)


class FavoriteCheckView(APIView):
    """View to check if an item is in favorites"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        item_type = request.query_params.get('type', '').lower()
        item_id = request.query_params.get('item_id')
        
        if not item_type or not item_id:
            return Response({"error": "Both type and item_id parameters are required"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        if item_type not in ['service', 'vehicle']:
            return Response({"error": "Type must be either 'service' or 'vehicle'"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Check if item is in favorites
        if item_type == 'service':
            is_favorite = Favorite.objects.filter(
                user=request.user, type='service', service=item_id
            ).exists()
        else:  # vehicle
            is_favorite = Favorite.objects.filter(
                user=request.user, type='vehicle', vehicle=item_id
            ).exists()
        
        return Response({"is_favorite": is_favorite})


class FavoriteToggleView(APIView):
    """View to toggle favorite status"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        item_type = request.data.get('type', '').lower()
        item_id = request.data.get('item_id')
        
        if not item_type or not item_id:
            return Response({"error": "Both type and item_id are required"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        if item_type not in ['service', 'vehicle']:
            return Response({"error": "Type must be either 'service' or 'vehicle'"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Check if item is already in favorites
        if item_type == 'service':
            existing = Favorite.objects.filter(
                user=request.user, type='service', service=item_id
            ).first()
        else:  # vehicle
            existing = Favorite.objects.filter(
                user=request.user, type='vehicle', vehicle=item_id
            ).first()
        
        if existing:
            # Remove from favorites
            existing.delete()
            return Response({
                "message": "Removed from favorites",
                "added": False
            }, status=status.HTTP_200_OK)
        else:
            # Add to favorites
            data = {
                'type': item_type,
                item_type: item_id
            }
            serializer = FavoriteSerializer(data=data, context={'request': request})
            if serializer.is_valid():
                favorite = serializer.save()
                return Response({
                    "message": "Added to favorites",
                    "added": True,
                    "favorite": FavoriteSerializer(favorite).data
                }, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            