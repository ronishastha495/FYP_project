from django.test import TestCase
from django.contrib.auth import get_user_model
from chat_app.models import ChatMessage

User = get_user_model()

class ChatMessageReadStatusTestCase(TestCase):
    def setUp(self):
        self.sender = User.objects.create_user(
            username="sender",
            email="sender@example.com",
            password="senderpass123",
            role="customer"
        )
        self.receiver = User.objects.create_user(
            username="receiver",
            email="receiver@example.com",
            password="receiverpass123",
            role="service_manager"
        )

    def test_mark_chat_message_as_read(self):
        try:
            message = ChatMessage.objects.create(
                sender=self.sender,
                receiver=self.receiver,
                message="Hello, how are you?",
                is_read=False
            )
            self.assertFalse(message.is_read)
            message.is_read = True
            message.save()
            updated_message = ChatMessage.objects.get(id=message.id)
            self.assertTrue(updated_message.is_read)
            print("Test Successful: Chat Message Marked as Read")
        except Exception as e:
            print(f"Test Failed: Chat Message Mark as Read Error - {str(e)}")
            self.fail(f"Chat message mark as read failed: {str(e)}")

    def test_create_chat_message_default_is_read(self):
        try:
            message = ChatMessage.objects.create(
                sender=self.sender,
                receiver=self.receiver,
                message="Hello, how are you?"
            )
            self.assertFalse(message.is_read)  # Default should be False
            print("Test Successful: Chat Message Default is_read Verified")
        except Exception as e:
            print(f"Test Failed: Chat Message Default is_read Error - {str(e)}")
            self.fail(f"Chat message default is_read failed: {str(e)}")