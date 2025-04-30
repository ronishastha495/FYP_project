from django.test import TestCase
from django.contrib.auth import get_user_model
from chat_app.models import ChatMessage
from django.core.exceptions import ValidationError
from django.db import IntegrityError

User = get_user_model()

class ChatMessageValidationTestCase(TestCase):
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

    def test_chat_message_missing_message(self):
        try:
            with self.assertRaises(ValidationError):
                message = ChatMessage(
                    sender=self.sender,
                    receiver=self.receiver,
                    is_read=False
                )
                message.full_clean()
                message.save()
            print("Test Successful: Chat Message Missing Message Detected")
        except AssertionError as e:
            print("Test Failed: Chat Message Missing Message Not Detected")
            raise e

    def test_chat_message_message_too_long(self):
        try:
            with self.assertRaises(ValidationError):
                message = ChatMessage(
                    sender=self.sender,
                    receiver=self.receiver,
                    message="x" * 10001,  # Exceeds max_length of 10000
                    is_read=False
                )
                message.full_clean()
                message.save()
            print("Test Successful: Chat Message Too Long Detected")
        except AssertionError as e:
            print("Test Failed: Chat Message Too Long Not Detected")
            raise e