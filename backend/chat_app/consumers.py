import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from .models import Message
from datetime import datetime

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract token from query string
        query_string = self.scope.get('query_string', b'').decode('utf-8')
        token_param = [param.split('=') for param in query_string.split('&') if param.startswith('token=')]
        token = token_param[0][1] if token_param else None

        if not token:
            await self.close()
            return

        # Authenticate user with JWT
        try:
            access_token = AccessToken(token)
            user = await self.get_user(access_token['user_id'])
            if not user.is_authenticated:
                await self.close()
                return
            self.scope['user'] = user
        except Exception as e:
            print(f"Authentication error: {str(e)}")
            await self.close()
            return

        # Get room name from URL route
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        print(f"WebSocket connected for {user.username} in room {self.room_name}")

    async def disconnect(self, close_code):
        # Leave room group
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            print(f"WebSocket disconnected from {self.room_group_name}")

    async def receive(self, text_data):
        try:
            # Receive and parse the message
            text_data_json = json.loads(text_data)
            message = text_data_json.get('message')
            sender_id = text_data_json.get('sender_id')
            receiver_id = text_data_json.get('receiver_id')

            # Check if required fields are present
            if not all([message, sender_id, receiver_id]):
                raise ValueError("Missing required fields")

            # Verify sender is the authenticated user
            if str(self.scope['user'].id) != str(sender_id):
                raise PermissionError("User not authorized to send this message")

            # Save message to the database
            saved_message = await self.save_message(
                sender_id=sender_id,
                receiver_id=receiver_id,
                content=message
            )

            # Send the message to the room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender_id': sender_id,
                    'receiver_id': receiver_id,
                    'timestamp': saved_message.timestamp.isoformat(),
                    'message_id': str(saved_message.id)
                }
            )

        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({'error': 'Invalid JSON'}))
        except ValueError as e:
            await self.send(text_data=json.dumps({'error': str(e)}))
            print(f"Error: {str(e)}")
        except PermissionError as e:
            await self.send(text_data=json.dumps({'error': str(e)}))
            print(f"Error: {str(e)}")
        except Exception as e:
            await self.send(text_data=json.dumps({'error': str(e)}))
            print(f"Error processing message: {str(e)}")

    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message'],
            'sender_id': event['sender_id'],
            'receiver_id': event['receiver_id'],
            'timestamp': event['timestamp'],
            'message_id': event['message_id']
        }))

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()

    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, content):
        try:
            # Ensure both sender and receiver exist
            sender = User.objects.get(id=sender_id)
            receiver = User.objects.get(id=receiver_id)
            
            # Save the message
            message = Message.objects.create(
                sender=sender,
                receiver=receiver,
                content=content
            )
            print(f"Message saved: {message.id}, Sender: {sender.username}, Receiver: {receiver.username}")
            return message
        except Exception as e:
            print(f"Error saving message: {str(e)}")  # Log any errors
            raise e

    @database_sync_to_async
    def mark_messages_as_read(self, sender_id, receiver_id):
        Message.objects.filter(
            sender_id=sender_id,
            receiver_id=receiver_id,
            read=False
        ).update(read=True)
