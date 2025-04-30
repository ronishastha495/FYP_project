import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useBooking } from "../../contexts/BookingContext";
import backgroundImage from "../../assets/background.jpg";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

import "react-toastify/dist/ReactToastify.css"; 

// Component for loading spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Component for error display
const ErrorDisplay = ({ message, onRetry }) => (
  <div className="text-center py-6 bg-red-900/30 rounded-lg">
    <p className="text-red-400 mb-4">{message || "An error occurred"}</p>
    <button
      onClick={onRetry}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Component for empty state
const EmptyState = ({ title, description, actionText, onAction }) => (
  <div className="text-center py-8 bg-gray-800/50 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
    <p className="text-gray-400 mb-6">{description}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {actionText}
      </button>
    )}
  </div>
);

// Notification Component
const Notification = ({ onClose, notifications, setNotifications }) => {
  const [filter, setFilter] = useState("all");

  // Ensure notifications is an array before proceeding
  if (!Array.isArray(notifications)) {
    return (
      <div className="absolute right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl p-4 z-50 border border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-300">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-xl"
          >
            ×
          </button>
        </div>
        <p className="text-gray-400 text-sm text-center py-4">
          Error: Unable to load notifications.
        </p>
      </div>
    );
  }

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((notif) => !notif.isRead)
      : notifications;

  const newNotifications = filteredNotifications.filter((notif) => notif.isNew);
  const earlierNotifications = filteredNotifications.filter(
    (notif) => !notif.isNew
  );

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    toast.success("Notification marked as read!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl p-4 z-50 border border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-300">Notifications</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 text-xl"
        >
          ×
        </button>
      </div>
      <div className="flex space-x-2 mb-3">
        <button
          onClick={() => setFilter("all")}
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          } transition duration-200`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            filter === "unread"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          } transition duration-200`}
        >
          Unread
        </button>
      </div>
      {notifications.length > 0 && (
        <div className="flex justify-end mb-3">
          <button
            onClick={clearAll}
            className="text-sm text-red-400 hover:text-red-300 hover:underline"
          >
            Clear All
          </button>
        </div>
      )}
      {newNotifications.length > 0 && (
        <>
          <h4 className="text-xs font-semibold text-gray-400 mb-2">NEW</h4>
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {newNotifications.map((notification) => (
              <li
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`flex items-start space-x-3 p-2 rounded-md transition duration-200 cursor-pointer ${
                  notification.isRead ? "bg-gray-700/50" : "bg-blue-900/30"
                } hover:bg-gray-700`}
              >
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-lg">{notification.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      {earlierNotifications.length > 0 && (
        <>
          <h4 className="text-xs font-semibold text-gray-400 mt-4 mb-2">
            EARLIER
          </h4>
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {earlierNotifications.map((notification) => (
              <li
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`flex items-start space-x-3 p-2 rounded-md transition duration-200 cursor-pointer ${
                  notification.isRead ? "bg-gray-700/50" : "bg-blue-900/30"
                } hover:bg-gray-700`}
              >
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-lg">{notification.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      {filteredNotifications.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-4">
          No {filter === "unread" ? "unread" : ""} notifications
        </p>
      )}
      {notifications.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 text-sm font-medium"
          >
            See All
          </button>
        </div>
      )}
    </div>
  );
};

// User Profile Component
const UserProfile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    profile_picture: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:8000/auth-app/api/user/profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profileData = response.data || {};
        setProfile(profileData);
        setFormData(profileData);
      } catch (err) {
        console.error("Error fetching data for user profile:", err);
        setError("Failed to load user profile data. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    const updatedProfile = { ...formData };

    if (!updatedProfile.profile_picture) {
      updatedProfile.profile_picture = profile.profile_picture;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        "http://localhost:8000/account/profile/",
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setProfile(response.data);
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setFormData({ ...formData, profile_picture_url: fakeUrl });
      setProfile({ ...profile, profile_picture_url: fakeUrl });
      toast.success("Profile picture updated!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-300 mb-4">
          Edit Profile
        </h2>
        <form onSubmit={handleProfileSubmit}>
          <div className="mb-4 flex items-center">
            {formData.profile_picture_url ? (
              <img
                src={formData.profile_picture_url}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover mr-4 border-2 border-blue-500"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-700 mr-4 flex items-center justify-center border-2 border-gray-600">
                <span className="text-gray-400 text-xl font-bold">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
                </span>
              </div>
            )}
            <div className="flex-1">
              <label className="block text-gray-400 mb-2 text-sm">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700/70 text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2 text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleProfileChange}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700/70 text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleProfileChange}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700/70 text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2 text-sm">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleProfileChange}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700/70 text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2 text-sm">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleProfileChange}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700/70 text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-400 mb-2 text-sm">City</label>
              <input
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={handleProfileChange}
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700/70 text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country || ""}
                onChange={handleProfileChange}
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700/70 text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/20"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-300 mb-4">
          Profile Information
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {profile.profile_picture_url ? (
              <img
                src={profile.profile_picture_url}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600">
                <span className="text-gray-400 text-2xl font-bold">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-200">{profile.name || "No Name"}</h3>
              <p className="text-gray-400">{profile.email || "No Email"}</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Phone</span>
              <span className="text-gray-200">{profile.phone || "Not provided"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Address</span>
              <span className="text-gray-200">{profile.address || "Not provided"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">City</span>
              <span className="text-gray-200">{profile.city || "Not provided"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Country</span>
              <span className="text-gray-200">{profile.country || "Not provided"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Favorites Component
const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:8000/api/favorites/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFavorites(response.data || []);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Failed to load favorites. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleAction = (favorite) => {
    if (favorite.type === "Service") {
      navigate(`/booking?service=${favorite.id}`);
      toast.info(`Booking ${favorite.name} service`, {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      navigate(`/vehicles/${favorite.id}`);
      toast.info(`Viewing ${favorite.name} ${favorite.model}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const removeFavorite = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:8000/api/favorites/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(favorites.filter(fav => fav.id !== id));
      toast.success("Removed from favorites", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error removing favorite:", err);
      toast.error("Failed to remove from favorites", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="No Favorites Added"
        description="Add your favorite services or vehicles to access them quickly!"
        actionText="Browse Services"
        onAction={() => navigate("/services")}
      />
    );
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-300 mb-4">Favorites</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700/70 transition-all duration-300 border border-gray-600/50"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-200 font-medium">{favorite.name}</h3>
                {favorite.type === "Vehicle" && (
                  <p className="text-gray-400 text-sm">
                    {favorite.model} ({favorite.year})
                  </p>
                )}
                {favorite.description && (
                  <p className="text-gray-400 text-sm mt-1">{favorite.description}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAction(favorite)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/20"
                >
                  {favorite.type === "Service" ? "Book" : "View"}
                </button>
                <button
                  onClick={() => removeFavorite(favorite.id)}
                  className="p-1 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Reminders Component
const Reminders = () => {
  const [reminders, setReminders] = useState([
    { id: 1, message: "Oil Change due for Toyota Camry", date: "2024-10-05", priority: "high" },
    { id: 2, message: "Tire Alignment check for Honda Civic", date: "2024-10-10", priority: "medium" },
    { id: 3, message: "Brake pad replacement", date: "2024-10-20", priority: "low" },
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReminderAction = (reminder) => {
    toast.info(`Viewing details for ${reminder.message}`, {
      position: "top-right",
      autoClose: 3000,
    });
    navigate(`/service-details/${reminder.id}`);
  };

  const dismissReminder = (id) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    toast.success("Reminder dismissed", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400";
      case "low":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-blue-500/20 text-blue-400";
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (reminders.length === 0) {
    return (
      <EmptyState
        title="No Reminders"
        description="Schedule a service to set reminders for your vehicle maintenance!"
        actionText="Schedule Service"
        onAction={() => navigate("/booking")}
      />
    );
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-300 mb-4">Reminders</h2>
      <div className="space-y-4">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700/70 transition-all duration-300 border border-gray-600/50"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(reminder.priority)}`}>
                    {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)}
                  </span>
                  <p className="text-gray-400 text-sm">Due: {reminder.date}</p>
                </div>
                <p className="text-gray-200 font-medium">{reminder.message}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleReminderAction(reminder)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/20"
                >
                  View Details
                </button>
                <button
                  onClick={() => dismissReminder(reminder.id)}
                  className="p-1 bg-gray-600/50 text-gray-400 rounded-full hover:bg-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const UserDash = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("appointments");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Your appointment has been confirmed",
      time: "10 minutes ago",
      icon: "✅",
      isRead: false,
      isNew: true,
    },
    {
      id: 2,
      message: "New service recommendation for your BMW X5",
      time: "2 hours ago",
      icon: "🔧",
      isRead: false,
      isNew: true,
    },
    {
      id: 3,
      message: "Oil change completed successfully",
      time: "Yesterday",
      icon: "🛠️",
      isRead: true,
      isNew: false,
    },
  ]);

  // Use BookingContext for bookings
  const { bookings, loading, error, fetchUserBookings } = useBooking();

  // Fetch bookings on mount
  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  // Fetch notifications dynamically
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No access token found");
        const response = await axios.get("http://localhost:8000/notifications/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(Array.isArray(response.data) ? response.data : notifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        toast.error("Failed to load notifications.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchNotifications();
  }, []);

  // Handle appointment action
  const handleAppointmentAction = (appointment) => {
    const detailMessage = `
      Appointment Details:
      Service: ${appointment.service?.name || "N/A"}
      Vehicle: ${appointment.vehicle?.make || "N/A"} ${appointment.vehicle?.model || ""}
      Date: ${appointment.date}
      Time: ${appointment.time}
      Price: $${parseFloat(appointment.total_price || 0).toFixed(2)}
      Status: ${appointment.status.replace("_", " ")}
    `;
    toast.info(detailMessage, {
      position: "top-right",
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    navigate(`/appointment/${appointment.booking_id}`);
  };

  // Responsive status badge styling
  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "confirmed":
        return "bg-green-500/20 text-green-400";
      case "in_progress":
        return "bg-blue-500/20 text-blue-400";
      case "completed":
        return "bg-purple-500/20 text-purple-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col text-gray-200"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="min-h-screen flex flex-col bg-gray-900/70">
        <Navbar />
        <div className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            {/* Notification Bell */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-gray-800/80 backdrop-blur-sm rounded-full text-gray-300 hover:bg-gray-700/80 transition-colors shadow-lg"
              >
                🔔
                {notifications.filter((notif) => !notif.isRead).length > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter((notif) => !notif.isRead).length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <Notification
                  onClose={() => setShowNotifications(false)}
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              )}
            </div>

            {/* Sub-Navigation */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-full p-1 flex justify-around mb-8 shadow-xl border border-gray-700/50">
              {["appointments", "profile", "favorites", "reminders"].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold ${
                    activeSection === section
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-700/50"
                  } transition-all duration-200`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>

            {/* Appointments Section */}
            {activeSection === "appointments" && (
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                <h2 className="text-xl font-semibold text-gray-300 mb-4">
                  Service Appointments ({bookings.length})
                </h2>
                {loading ? (
                  <LoadingSpinner />
                ) : error ? (
                  <ErrorDisplay
                    message={error?.message || "Failed to load appointments."}
                    onRetry={fetchUserBookings}
                  />
                ) : bookings.length === 0 ? (
                  <EmptyState
                    title="No Appointments Found"
                    description="Schedule a service or repair for your vehicle to get started!"
                    actionText="Book a Service"
                    onAction={() => navigate("/booking")}
                  />
                ) : (
                  <div className="overflow-x-auto">
                    {/* Desktop Table View */}
                    <div className="hidden md:grid grid-cols-8 gap-4 text-gray-400 font-semibold border-b border-gray-700/50 pb-2">
                      <div>ID</div>
                      <div>Vehicle</div>
                      <div>Service</div>
                      <div>Date</div>
                      <div>Time</div>
                      <div>Price</div>
                      <div>Status</div>
                      <div>Action</div>
                    </div>
                    {/* Mobile Card View */}
                    <div className="space-y-4">
                      {bookings.map((appointment) => (
                        <div
                          key={appointment.booking_id}
                          className="md:grid md:grid-cols-8 gap-4 py-3 border-b border-gray-700/50 items-center md:bg-transparent bg-gray-700/50 md:p-0 p-4 rounded-lg"
                        >
                          {/* Desktop Table Row */}
                          <div className="hidden md:block">
                            #{appointment.booking_id.substring(0, 8)}
                          </div>
                          <div className="hidden md:flex items-center space-x-2">
                            {appointment.vehicle ? (
                              <>
                                <img
                                  src={appointment.vehicle.image}
                                  alt={`${appointment.vehicle.make} ${appointment.vehicle.model}`}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                                />
                                <span className="text-sm">
                                  {appointment.vehicle.make} {appointment.vehicle.model}
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </div>
                          <div className="hidden md:block">
                            {appointment.service?.name || "N/A"}
                          </div>
                          <div className="hidden md:block">{appointment.date}</div>
                          <div className="hidden md:block">{appointment.time}</div>
                          <div className="hidden md:block">
                            ${parseFloat(appointment.total_price || 0).toFixed(2)}
                          </div>
                          <div className="hidden md:block">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeStyles(
                                appointment.status
                              )}`}
                            >
                              {appointment.status.replace("_", " ")}
                            </span>
                          </div>
                          <div className="hidden md:block">
                            <button
                              onClick={() => handleAppointmentAction(appointment)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/20"
                            >
                              View
                            </button>
                          </div>
                          {/* Mobile Card Content */}
                          <div className="md:hidden flex flex-col space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-300">
                                #{appointment.booking_id.substring(0, 8)}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeStyles(
                                  appointment.status
                                )}`}
                              >
                                {appointment.status.replace("_", " ")}
                              </span>
                            </div>
                            {appointment.vehicle && (
                              <div className="flex items-center space-x-2">
                                <img
                                  src={appointment.vehicle.image}
                                  alt={`${appointment.vehicle.make} ${appointment.vehicle.model}`}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                                />
                                <span className="text-sm text-gray-200">
                                  {appointment.vehicle.make} {appointment.vehicle.model}
                                </span>
                              </div>
                            )}
                            <p className="text-sm text-gray-400">
                              <strong>Service:</strong> {appointment.service?.name || "N/A"}
                            </p>
                            <p className="text-sm text-gray-400">
                              <strong>Date:</strong> {appointment.date}
                            </p>
                            <p className="text-sm text-gray-400">
                              <strong>Time:</strong> {appointment.time}
                            </p>
                            <p className="text-sm text-gray-400">
                              <strong>Price:</strong> $
                              {parseFloat(appointment.total_price || 0).toFixed(2)}
                            </p>
                            <button
                              onClick={() => handleAppointmentAction(appointment)}
                              className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/20"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Section */}
            {activeSection === "profile" && <UserProfile />}

            {/* Favorites Section */}
            {activeSection === "favorites" && <Favorites />}

            {/* Reminders Section */}
            {activeSection === "reminders" && <Reminders />}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default UserDash;