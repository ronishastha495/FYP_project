from django.contrib import admin
from .models import ChatMessage

class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'message', 'is_read', 'date')
    list_filter = ('is_read', 'date')
    search_fields = ('message',)

admin.site.register(ChatMessage, ChatMessageAdmin)
