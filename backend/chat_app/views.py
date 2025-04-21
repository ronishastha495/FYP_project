from django.shortcuts import render
from django.db.models import Q
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User, ChatMessage
from .serializers import MessageSerializer, ProfileSerializer

class GetMessagesListAPIView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Fetch all unique users the current user has chatted with
        message_partners = User.objects.filter(
            Q(sent_messages__receiver=user) | Q(received_messages__sender=user)
        ).distinct()

        # Collect chat messages between current user and each partner
        all_messages = ChatMessage.objects.filter(
            Q(sender=user, receiver__in=message_partners) |
            Q(sender__in=message_partners, receiver=user)
        ).order_by('date')

        return all_messages

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class SendMessageCreateAPIView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]


class ReadMessagesUpdateAPIView(generics.UpdateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        sender_id = self.request.user.id
        receiver_id = self.kwargs['receiver_id']

        return ChatMessage.objects.filter(
            Q(sender=sender_id, receiver=receiver_id) | Q(sender=receiver_id, receiver=sender_id),
            is_read=False
        )

    def update(self, request, *args, **kwargs):
        updated_count = self.get_queryset().update(is_read=True)
        if updated_count:
            return Response({'message': 'Messages marked as read'})
        return Response({'message': 'No unread messages found'})


class SearchUserAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        query = request.GET.get("user", "")  # Use "user" as the query parameter

        if query:
            users = User.objects.filter(
                Q(username__icontains=query) |
                Q(first_name__icontains=query) |
                Q(last_name__icontains=query)
            ).exclude(id=request.user.id)
        else:
            users = User.objects.none()

        results = [{
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "profile_picture": user.profile_picture.url if user.profile_picture else ""
        } for user in users]

        print(f"result is : {results}")
        return Response(results)
