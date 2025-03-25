from rest_framework import permissions

class IsServiceManager(permissions.BasePermission):
    """
    Custom permission to allow only Service Managers to manage Vehicles and Services.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "service_manager"


class IsCustomer(permissions.BasePermission):
    """
    Custom permission to allow only Customers to access their own data.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "customer"

    def has_object_permission(self, request, view, obj):
        # Ensure customers can only access their own objects
        return obj.customer == request.user
