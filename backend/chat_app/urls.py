
from django.urls import path
from . import views

urlpatterns = [
    path('conversations/', views.conversation_list, name='conversation-list'),
    path('messages/', views.message_list, name='message-list'),
    path('messages/mark-read/', views.mark_messages_as_read, name='mark-messages-read'),
    path('messages/create/', views.MessageListCreate.as_view(), name='message-create'),
]
