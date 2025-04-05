import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

const ProtectedRoute = ({ element, allowedRoles }) => {
    const { isAuthenticated, role, isLoading } = useAuth();

    // Show loading indicator while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to home if user doesn't have required role
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    // User is authenticated and has required role, render the element
    return element;
};

export default ProtectedRoute;
