# from django.core.mail import send_mail
# from django.utils import timezone
# from .models import Reminder, Booking
# from datetime import timedelta

# def send_reminder_email(reminder_id):
#     try:
#         reminder = Reminder.objects.get(id=reminder_id)
#         if reminder.sent:
#             return

#         booking = reminder.booking
#         user = booking.user
#         subject = f"Reminder: Your Booking for {booking.service}"
#         message = (
#             f"Dear {user.username},\n\n"
#             f"This is a reminder for your booking:\n"
#             f"Service: {booking.service}\n"
#             f"Date: {booking.date}\n"
#             f"Time: {booking.time}\n"
#             f"Vehicle: {booking.vehicle_model or 'N/A'}\n"
#             f"Notes: {booking.notes or 'None'}\n\n"
#             f"We look forward to serving you!\n"
#             f"Best regards,\nAutoCare Team"
#         )
#         send_mail(
#             subject,
#             message,
#             'your-email@gmail.com',
#             [user.email],
#             fail_silently=False,
#         )
#         reminder.sent = True
#         reminder.save()
#     except Reminder.DoesNotExist:
#         pass