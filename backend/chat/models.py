from django.db import models
from django.conf import settings

class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="sent_messages", on_delete=models.CASCADE)  # Link to the sender
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="received_messages", on_delete=models.CASCADE)  # Link to the receiver
    content = models.TextField()  # Message content
    timestamp = models.DateTimeField(auto_now_add=True)  # Timestamp of the message

    def __str__(self):
        return f"{self.sender} -> {self.receiver}: {self.content[:20]}"
