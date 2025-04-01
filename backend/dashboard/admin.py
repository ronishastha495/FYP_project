
from django.contrib import admin
from .models import UserAnalytics, AdminTracking, Rating
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Avg

@admin.register(UserAnalytics)
class UserAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_spent', 'services_completed', 'last_service_date', 'average_rating')
    search_fields = ('user__username',)
    readonly_fields = ('last_service_date',)
    list_per_page = 20

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            avg_rating=Avg('user__rating__rating')
        )

    def average_rating(self, obj):
        return f"{obj.avg_rating:.1f}★" if obj.avg_rating else "-"
    average_rating.admin_order_field = 'avg_rating'

@admin.register(AdminTracking)
class AdminTrackingAdmin(admin.ModelAdmin):
    list_display = ('admin', 'action', 'model', 'object_id', 'timestamp', 'details_preview')
    list_filter = ('action', 'model', 'timestamp')
    search_fields = ('admin__username', 'model', 'object_id')
    readonly_fields = ('timestamp',)
    date_hierarchy = 'timestamp'

    def details_preview(self, obj):
        return str(obj.details)[:50] + '...' if len(str(obj.details)) > 50 else str(obj.details)
    details_preview.short_description = 'Details'

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('booking', 'rating_stars', 'user', 'created_at', 'review_preview')
    list_filter = ('rating', 'created_at')
    search_fields = ('booking__id', 'user__username', 'review')
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at'

    def user(self, obj):
        return obj.booking.user
    user.admin_order_field = 'booking__user'

    def rating_stars(self, obj):
        return format_html(
            '<span style="color: gold; font-weight: bold;">{}</span>',
            '★' * obj.rating + '☆' * (5 - obj.rating)
        )
    rating_stars.short_description = 'Rating'
    rating_stars.admin_order_field = 'rating'

    def review_preview(self, obj):
        return obj.review[:50] + '...' if obj.review else "-"
    review_preview.short_description = 'Review'

    fieldsets = (
        (None, {
            'fields': ('booking', 'rating')
        }),
        ('Review', {
            'fields': ('review',)
        }),
        ('Metadata', {
            'fields': ('created_at',)
        }),
    )