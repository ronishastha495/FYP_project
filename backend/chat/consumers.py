# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from account.models import User
from chat.models import Conversation, Message

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user == AnonymousUser():
            await self.close()
            return

        # Join user's personal room
        await self.channel_layer.group_add(
            f"user_{self.user.id}",
            self.channel_name
        )
        
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'user') and self.user != AnonymousUser():
            await self.channel_layer.group_discard(
                f"user_{self.user.id}",
                self.channel_name
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        conversation_id = data['conversation_id']
        sender_id = data['sender_id']

        # Save message to database
        conversation = await self.get_conversation(conversation_id)
        sender = await self.get_user(sender_id)
        message_obj = await self.create_message(conversation, sender, message)

        # Send message to all participants
        for participant in await self.get_participants(conversation):
            await self.channel_layer.group_send(
                f"user_{participant.id}",
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender_id': sender_id,
                    'conversation_id': conversation_id,
                    'timestamp': str(message_obj.timestamp)
                }
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'conversation_id': event['conversation_id'],
            'timestamp': event['timestamp']
        }))

    @database_sync_to_async
    def get_conversation(self, conversation_id):
        return Conversation.objects.get(id=conversation_id)

    @database_sync_to_async
    def get_user(self, user_id):
        return User.objects.get(id=user_id)

    @database_sync_to_async
    def create_message(self, conversation, sender, content):
        return Message.objects.create(
            conversation=conversation,
            sender=sender,
            content=content
        )

    @database_sync_to_async
    def get_participants(self, conversation):
        return list(conversation.participants.all())