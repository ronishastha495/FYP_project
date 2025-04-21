from rest_framework.permissions import BasePermission

class IsCustomer(BasePermission):
    """
    Allows access only to users with role 'customer'.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', None) == 'customer')
