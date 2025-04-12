from django.contrib import admin
from .models import User

# Custom Admin for UserProfile
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'address', 'city', 'country', 'bio', 'profile_picture')
    search_fields = ('user__username', 'city', 'country')

# Register models in admin
admin.site.register(User)
