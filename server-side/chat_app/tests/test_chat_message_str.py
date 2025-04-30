from django.test import TestCase
from django.contrib.auth import get_user_model
from chat_app.models import ChatMessage

User = get_user_model()

class ChatMessageStrTestCase(TestCase):
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

    def test_chat_message_str_method(self):
        try:
            message = ChatMessage.objects.create(
                sender=self.sender,
                receiver=self.receiver,
                message="Hello, how are you?",
                is_read=False
            )
            expected_str = f"{self.sender.username} to {self.receiver.username}"
            self.assertEqual(str(message), expected_str)
            print("Test Successful: Chat Message String Method Verified")
        except Exception as e:
            print(f"Test Failed: Chat Message String Method Error - {str(e)}")
            self.fail(f"Chat message string method failed: {str(e)}")