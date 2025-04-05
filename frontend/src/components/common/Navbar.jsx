import React from "react";
  import { Link, useNavigate, useLocation } from "react-router-dom"; // Add useLocation
  import { Bell, User, LogOut } from "lucide-react";
  import { useAuth } from "../../contexts/useAuth";

  const Navbar = () => {
    const { isAuthenticated, role } = useAuth(); // Get auth state from context
    const navigate = useNavigate();
    const { logout_user } = useAuth();
    const location = useLocation(); // Get current location

    const notificationCount = 3;

    const handleLogout = async () => {
      try {
        await logout_user();
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    // Function to check if the link is active
    const isActive = (path) => location.pathname === path;

    return (
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              AutoCare
            </Link>

            {/* Navigation Links */}
            <div className="flex space-x-8">
              <Link
                to="/"
                className={`${
                  isActive("/") ? "text-indigo-600" : "text-gray-600"
                } hover:text-indigo-600`}
              >
                Home
              </Link>
              <Link
                to="/services"
                className={`${
                  isActive("/services") ? "text-indigo-600" : "text-gray-600"
                } hover:text-indigo-600`}
              >
                Services
              </Link>
              <Link
                to="/booking"
                className={`${
                  isActive("/booking") ? "text-indigo-600" : "text-gray-600"
                } hover:text-indigo-600`}
              >
                Book Appointment
              </Link>
              <Link
                to="/tracking"
                className={`${
                  isActive("/tracking") ? "text-indigo-600" : "text-gray-600"
                } hover:text-indigo-600`}
              >
                Tracking
              </Link>
              {role === "User" && (
                <Link
                  to="/userdash"
                  className={`${
                    isActive("/userdash") ? "text-indigo-600" : "text-gray-600"
                  } hover:text-indigo-600`}
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Notification Bell */}
                  <div className="relative">
                    <Bell className="h-6 w-6 text-gray-600 hover:text-indigo-600 cursor-pointer" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </div>

                  {/* User Icon linking to appropriate dashboard */}
                  {role === "Service Manager" ? (
                    <Link to="/manager" className="text-gray-600 hover:text-indigo-600">
                      <User className="h-6 w-6" />
                    </Link>
                  ) : (
                    <Link to="/userdash" className="text-gray-600 hover:text-indigo-600">
                      <User className="h-6 w-6" />
                    </Link>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    style={{ background: "linear-gradient(to right, #E8B65A, #524CAD)" }}
                    className="px-4 py-2 text-white rounded-lg hover:opacity-95 transition-opacity flex items-center space-x-2 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                /* Login Button */
                <Link to="/login">
                  <button
                    style={{ background: "linear-gradient(to right, #E8B65A, #524CAD)" }}
                    className="px-4 py-2 text-white rounded-lg hover:opacity-95 transition-opacity"
                  >
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;