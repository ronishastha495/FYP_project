from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta
from .models import UserAnalytics, AdminTracking, Rating
from .serializers import (
    UserAnalyticsSerializer, 
    AdminTrackingSerializer,
    RatingSerializer,
    DashboardFilterSerializer
)
from services.models import Booking
from django.contrib.auth import get_user_model

User = get_user_model()

class DashboardViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def user_analytics(self, request):
        analytics, _ = UserAnalytics.objects.get_or_create(user=request.user)
        serializer = UserAnalyticsSerializer(analytics)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def booking_stats(self, request):
        serializer = DashboardFilterSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        
        filters = {'user': request.user}
        if serializer.validated_data.get('date_from'):
            filters['date__gte'] = serializer.validated_data['date_from']
        if serializer.validated_data.get('date_to'):
            filters['date__lte'] = serializer.validated_data['date_to']
        if serializer.validated_data.get('service_type'):
            filters['primary_service__service_type'] = serializer.validated_data['service_type']
        if serializer.validated_data.get('status'):
            filters['status'] = serializer.validated_data['status']
        
        stats = Booking.objects.filter(**filters).aggregate(
            total=Count('id'),
            completed=Count('id', filter=models.Q(status='completed')),
            total_spent=Sum('final_cost'),
            avg_rating=Avg('rating__rating')
        )
        
        return Response(stats)

    @action(detail=False, methods=['get'])
    def spending_history(self, request):
        history = Booking.objects.filter(
            user=request.user,
            status='completed'
        ).order_by('-date').values('date', 'final_cost', 'primary_service__name')
        
        return Response(list(history))

class AdminDashboardViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['get'])
    def overview(self, request):
        data = {
            'total_users': User.objects.count(),
            'active_bookings': Booking.objects.filter(status__in=['confirmed', 'in_progress']).count(),
            'revenue': Booking.objects.filter(status='completed').aggregate(
                Sum('final_cost')
            )['final_cost__sum'] or 0,
            'recent_activities': AdminTrackingSerializer(
                AdminTracking.objects.all().order_by('-timestamp')[:10],
                many=True
            ).data
        }
        return Response(data)

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(booking__user=self.request.user)

    def perform_create(self, serializer):
        booking = serializer.validated_data['booking']
        if booking.user != self.request.user:
            raise PermissionDenied("You can only rate your own bookings")
        serializer.save()