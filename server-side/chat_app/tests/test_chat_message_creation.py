from django.test import TestCase
from django.contrib.auth import get_user_model
from chat_app.models import ChatMessage

User = get_user_model()

class ChatMessageCreationTestCase(TestCase):
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

    def test_create_chat_message(self):
        try:
            message = ChatMessage.objects.create(
                sender_id=self.sender.id,
                receiver_id=self.receiver.id,
                message="Hello, world!"
            )
            self.assertIsNotNone(message)
            self.assertEqual(message.message, "Hello, world!")
            self.assertEqual(message.receiver, self.receiver)
            self.assertFalse(message.is_read)
            print("Test Successful: Chat Message Created")
        except Exception as e:
            print(f"Test Failed: Chat Message Creation Error - {str(e)}")
            self.fail(f"Chat message creation failed: {str(e)}")
