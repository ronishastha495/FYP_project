from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from .models import ServiceManagerProfile

User = get_user_model()

# User Profile Serializer
class UserProfileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = User  # Ensure the correct model is used
        fields = ("id", "name", "email", "phone", "address", "city", "country", "profile_picture_url")

    def get_name(self, obj):
        return obj.username if obj else None

    def get_email(self, obj):
        return obj.email if obj else None

    def get_phone(self, obj):
        return obj.phone_number if hasattr(obj, "phone_number") else None

    def get_profile_picture_url(self, obj):
        request = self.context.get("request")
        if obj.profile_picture and request:
            return request.build_absolute_uri(obj.profile_picture.url)
        return None


# User Serializer (To Display User Info)
class UserSerializer(serializers.ModelSerializer):
    # profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'phone_number', 'profile_picture')

# Service Manager Profile Serializer
class ServiceManagerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceManagerProfile
        fields = ['service_center_name', 'experience_years', 'location', 'contact_number']

# Update User Profile Serializer
class UpdateUserProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(   required=False)
    email = serializers.EmailField( required=False)
    phone_number = serializers.CharField(  required=False)
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User  # We're updating the User model directly here
        fields = ["id", "name", "email", "phone_number", "address", "city", "country", "profile_picture"]

    def update(self, instance, validated_data):
        """Update User model fields."""
        # Update User fields (username, email, phone_number, etc.)
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        instance.phone_number = validated_data.get("phone_number", instance.phone_number)
        instance.address = validated_data.get("address", instance.address)
        instance.city = validated_data.get("city", instance.city)
        instance.country = validated_data.get("country", instance.country)
        
        # Handle profile_picture update
        if 'profile_picture' in validated_data:
            instance.profile_picture = validated_data["profile_picture"]

        # Save the updated user instance
        instance.save()

        return instance

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role', 'profile_picture')

    def create(self, validated_data):
        profile_picture = validated_data.pop("profile_picture", None)
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=make_password(validated_data['password']),
            role=validated_data['role']
        )
        
        if profile_picture:
            user.profile_picture = profile_picture
            user.save()

        return user

# Login Serializer
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        from django.contrib.auth import authenticate
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")

# Password Reset Serializer
class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

# Change Password Serializer
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
