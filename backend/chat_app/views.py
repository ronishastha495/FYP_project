from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q, Max
from .models import Message
from .serializers import MessageSerializer
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def conversation_list(request):
    # Get all unique conversations for the current user
    conversations = Message.objects.filter(
        Q(sender=request.user) | Q(receiver=request.user)
    ).values(
        'sender', 'receiver'
    ).annotate(
        last_message_time=Max('timestamp')
    ).order_by('-last_message_time')

    result = []
    for conv in conversations:
        other_user_id = conv['sender'] if conv['sender'] != request.user.id else conv['receiver']
        try:
            other_user = User.objects.get(pk=other_user_id)
            last_message = Message.objects.filter(
                Q(sender=request.user, receiver=other_user) |
                Q(sender=other_user, receiver=request.user)
            ).latest('timestamp')
            
            result.append({
                'other_user': {
                    'id': other_user.id,
                    'name': other_user.get_full_name() or other_user.username,
                    'avatar': other_user.profile.avatar.url if hasattr(other_user, 'profile') else None,
                    # Removed is_online
                },
                'last_message': last_message.content,
                'last_message_time': last_message.timestamp,
                'unread_count': Message.objects.filter(
                    receiver=request.user,
                    sender=other_user,
                    read=False
                ).count()
            })
        except User.DoesNotExist:
            continue

    return Response(result)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def message_list(request):
    other_user_id = request.query_params.get('user_id')
    if not other_user_id:
        return Response({'error': 'user_id parameter is required'}, status=400)

    messages = Message.objects.filter(
        Q(sender=request.user, receiver=other_user_id) |
        Q(sender=other_user_id, receiver=request.user)
    ).order_by('timestamp')

    # Mark messages as read
    Message.objects.filter(
        sender=other_user_id,
        receiver=request.user,
        read=False
    ).update(read=True)

    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_messages_as_read(request):
    sender_id = request.data.get('sender_id')
    if not sender_id:
        return Response({'error': 'sender_id is required'}, status=400)
    
    Message.objects.filter(
        sender_id=sender_id,
        receiver=request.user,
        read=False
    ).update(read=True)
    
    return Response({'status': 'success'})

class MessageListCreate(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        other_user_id = self.request.query_params.get('user_id')
        if not other_user_id:
            return Message.objects.none()

        try:
            other_user = User.objects.get(id=other_user_id)
        except User.DoesNotExist:
            return Message.objects.none()

        return Message.objects.filter(
            Q(sender=self.request.user, receiver=other_user) |
            Q(sender=other_user, receiver=self.request.user)
        ).order_by('timestamp')

    def perform_create(self, serializer):
        # Ensure receiver is passed in the request data
        receiver_id = self.request.data.get('receiver')
        if not receiver_id:
            raise ValidationError('Receiver is required')

        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            raise ValidationError('Receiver does not exist')

        # Save the message with sender and receiver
        serializer.save(sender=self.request.user, receiver=receiver)

