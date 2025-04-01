from django.contrib import admin
from .models import Notification, OTP
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'notification_type', 'truncated_message', 'is_read', 'created_at', 'related_booking_link')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('user__username', 'message', 'title')
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at'
    actions = ['mark_as_read', 'mark_as_unread']

    fieldsets = (
        (None, {
            'fields': ('user', 'notification_type', 'is_read')
        }),
        ('Content', {
            'fields': ('title', 'message', 'related_booking')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'scheduled_at')
        }),
    )

    def truncated_message(self, obj):
        return obj.message[:50] + '...' if len(obj.message) > 50 else obj.message
    truncated_message.short_description = 'Message'

    def related_booking_link(self, obj):
        if obj.related_booking:
            url = reverse('admin:services_booking_change', args=[obj.related_booking.id])
            return format_html('<a href="{}">{}</a>', url, obj.related_booking)
        return "-"
    related_booking_link.short_description = 'Booking'
    related_booking_link.admin_order_field = 'related_booking'

    @admin.action(description='Mark selected as read')
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)

    @admin.action(description='Mark selected as unread')
    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False)

@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'purpose', 'expires_at', 'is_used', 'is_valid')
    list_filter = ('purpose', 'is_used')
    search_fields = ('user__username', 'code')
    readonly_fields = ('expires_at',)
    date_hierarchy = 'expires_at'

    def is_valid(self, obj):
        return obj.is_valid()
    is_valid.boolean = True
    is_valid.short_description = 'Valid'