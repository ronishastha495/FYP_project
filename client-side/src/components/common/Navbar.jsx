import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, User, LogOut, Car } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import Notification from "./Notification"; // Import the Notification component
// import logo from "../../assets/logo.png";


const Navbar = () => {
  const { isAuthenticated, role, logout_user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // State for notification panel

  const notificationCount = 0; // Updated to show dummy notifications

  const handleLogout = async () => {
    try {
      await logout_user();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
        
          <Link to="/" className="flex items-center space-x-2">
            <Car className="text-indigo-600 w-6 h-6" /> {/* Car icon */}
            <span className="text-2xl font-bold">
              <span className="text-black">Auto</span>
              <span className="text-indigo-600">Care</span>
            </span>
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
              to="/chat "
              className={`${
                isActive("/chat") ? "text-indigo-600" : "text-gray-600"
              } hover:text-indigo-600`}
            >
              Chat
            </Link>
            <Link
              to="/aboutus"
              className={`${
                isActive("/aboutus") ? "text-indigo-600" : "text-gray-600"
              } hover:text-indigo-600`}
            >
              About Us
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
                {/* Notification Bell with Panel */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="focus:outline-none"
                  >
                    <Bell className="h-6 w-6 text-gray-600 hover:text-indigo-600 cursor-pointer" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                  {isNotificationOpen && (
                    <Notification onClose={() => setIsNotificationOpen(false)} />
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