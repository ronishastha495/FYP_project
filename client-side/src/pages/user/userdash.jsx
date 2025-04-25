 import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import backgroundImage from "../../assets/background.jpg"; // Adjust path to your image
import axios from "axios";
import { toast } from "react-toastify";
import bookingService from "../../api/bookingService"; // Adjust the import path as necessary
import { useBooking } from "../../contexts/BookingContext";

// Notification Component
const Notification = ({ onClose, notifications, setNotifications }) => {
  const [filter, setFilter] = useState("all");

  // Ensure notifications is an array before proceeding
  if (!Array.isArray(notifications)) {
    console.error("Notifications is not an array:", notifications);
    return (
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        <p className="text-gray-500 text-sm text-center py-4">
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
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>
      <div className="flex space-x-2 mb-3">
        <button
          onClick={() => setFilter("all")}
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          } transition duration-200`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            filter === "unread"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          } transition duration-200`}
        >
          Unread
        </button>
      </div>
      {notifications.length > 0 && (
        <div className="flex justify-end mb-3">
          <button
            onClick={clearAll}
            className="text-sm text-red-500 hover:underline"
          >
            Clear All
          </button>
        </div>
      )}
      {newNotifications.length > 0 && (
        <>
          <h4 className="text-xs font-semibold text-gray-500 mb-2">NEW</h4>
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {newNotifications.map((notification) => (
              <li
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`flex items-start space-x-3 p-2 rounded-md transition duration-200 cursor-pointer ${
                  notification.isRead ? "bg-gray-50" : "bg-blue-50"
                } hover:bg-gray-100`}
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg">{notification.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-400">{notification.time}</p>
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
          <h4 className="text-xs font-semibold text-gray-500 mt-4 mb-2">
            EARLIER
          </h4>
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {earlierNotifications.map((notification) => (
              <li
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`flex items-start space-x-3 p-2 rounded-md transition duration-200 cursor-pointer ${
                  notification.isRead ? "bg-gray-50" : "bg-blue-50"
                } hover:bg-gray-100`}
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg">{notification.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-400">{notification.time}</p>
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
        <p className="text-gray-500 text-sm text-center py-4">
          No {filter === "unread" ? "unread" : "new"} notifications
        </p>
      )}
      {notifications.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 text-sm font-medium"
          >
            See All
          </button>
        </div>
      )}
    </div>
  );
};

const UserDash = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("appointments");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]); // Ensure initial state is an array

  // Use BookingContext for bookings
  const { bookings, loading, error, fetchUserBookings } = useBooking();

  useEffect(() => {
    fetchUserBookings();
  }, []);

  // Remove local appointments state and duplicate fetching logic

  // Fetch notifications dynamically
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:8000/notifications/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Ensure response.data is an array
        const fetchedNotifications = Array.isArray(response.data)
          ? response.data
          : [];
        console.log("Fetched notifications:", fetchedNotifications); // Debug log
        setNotifications(fetchedNotifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        toast.error("Failed to load notifications.", {
          position: "top-right",
          autoClose: 3000,
        });
        setNotifications([]); // Fallback to empty array on error
      }
    };

    fetchNotifications();
  }, []);

  function UserProfile() {
    const [profile, setProfile] = useState([]);
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
          const response = await axios.get("http://localhost:8000/account/profile/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

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
      return <div>Loading...</div>;
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/90 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-300 mb-4">Edit Profile</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="mb-4 flex items-center">
              {formData.profile_picture_url ? (
                <img
                  src={formData.profile_picture_url}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-600 mr-4 flex items-center justify-center">
                  <span className="text-gray-400">No photo</span>
                </div>
              )}
              <div className="flex-1">
                <label className="block text-gray-400 mb-2">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-200"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleProfileChange}
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleProfileChange}
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleProfileChange}
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleProfileChange}
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleProfileChange}
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleProfileChange}
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-200"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
        <div className="bg-gray-800/90 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-300 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Name</p>
              <p className="text-gray-200 font-medium">{profile.name}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p className="text-gray-200 font-medium">{profile.email}</p>
            </div>
            <div>
              <p className="text-gray-400">Phone</p>
              <p className="text-gray-200 font-medium">{profile.phone}</p>
            </div>
            <div>
              <p className="text-gray-400">Address</p>
              <p className="text-gray-200 font-medium">{profile.address}</p>
            </div>
            <div>
              <p className="text-gray-400">City</p>
              <p className="text-gray-200 font-medium">{profile.city}</p>
            </div>
            <div>
              <p className="text-gray-400">Country</p>
              <p className="text-gray-200 font-medium">{profile.country}</p>
            </div>
            <div>
              <p className="text-gray-400">Profile Picture</p>
              {profile.profile_picture_url ? (
                <img
                  src={formData.profile_picture_url || formData.profile_picture}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover mr-4"
                />
              ) : (
                <p className="text-gray-200 font-medium">No photo</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchFavorites = async () => {
        try {
          // Use the new favoriteService API
          const favoritesList = await favoriteService.fetchFavorites();
          setFavorites(favoritesList);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to load favorites. Please log in again.");
          toast.error("Failed to load favorites.", {
            position: "top-right",
            autoClose: 3000,
          });
        } finally {
          setLoading(false);
        }
      };

      fetchFavorites();
    }, []);

    const handleAction = (favorite) => {
      const message =
        favorite.type === "Service"
          ? `Book ${favorite.name} service`
          : `View ${favorite.name} for purchase`;
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
      });
    };

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    return (
      <div className="bg-gray-800/90 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-300 mb-4">Favorites</h2>
        {favorites.length > 0 ? (
          <div className="space-y-4">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="flex justify-between items-center border-b border-gray-700 pb-2"
              >
                <div>
                  <p className="text-gray-200 font-medium">
                    {favorite.name} {favorite.year}, {favorite.model} {favorite.description} (
                    {favorite.type})
                  </p>
                  {favorite.type === "Vehicle" && (
                    <p className="text-gray-400 text-sm">
                      {favorite.model} ({favorite.year})
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleAction(favorite)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {favorite.type === "Service" ? "Book Service" : "View Vehicle"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Favorites Added</h3>
            <p className="text-gray-400">
              Add your favorite services or vehicles to access them quickly!
            </p>
          </div>
        )}
      </div>
    );
  }

  const [reminders, setReminders] = useState([
    { id: 1, message: "Oil Change due for Toyota Camry", date: "2024-10-05" },
    { id: 2, message: "Tire Alignment check for Honda Civic", date: "2024-10-10" },
  ]);

  const handleAppointmentAction = (appointment) => {
    // Create a more detailed message with all appointment information
    const detailMessage = (
      `Appointment Details:\n` +
      `Service: ${appointment.service}\n` +
      `Vehicle: ${appointment.vehicle}\n` +
      `Date: ${appointment.date}\n` +
      `Time: ${appointment.time}\n` +
      `Price: $${typeof appointment.price === 'number' ? appointment.price.toFixed(2) : appointment.price}\n` +
      `Status: ${appointment.status}`
    );
    
    // Show a more detailed toast with appointment information
    toast.info(detailMessage, {
      position: "top-right",
      autoClose: 5000, // Show for longer since there's more information
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleReminderAction = (reminder) => {
    toast.success(`Viewing details for ${reminder.message}`, {
      position: "top-right",
      autoClose: 3000,
    });
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
                className="relative p-2 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 transition-colors"
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

            {/* Oval Sub-Navigation */}
            <div className="bg-gray-800/90 rounded-full p-1 flex justify-around mb-8 shadow-md">
              <button
                onClick={() => setActiveSection("appointments")}
                className={`px-6 py-2 rounded-full text-sm font-semibold ${
                  activeSection === "appointments"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Appointments
              </button>
              <button
                onClick={() => setActiveSection("profile")}
                className={`px-6 py-2 rounded-full text-sm font-semibold ${
                  activeSection === "profile"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveSection("favorites")}
                className={`px-6 py-2 rounded-full text-sm font-semibold ${
                  activeSection === "favorites"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Favorites
              </button>
              <button
                onClick={() => setActiveSection("reminders")}
                className={`px-6 py-2 rounded-full text-sm font-semibold ${
                  activeSection === "reminders"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Reminders
              </button>
            </div>

            {/* Appointments Section */}
            {activeSection === "appointments" && (
              <div className="bg-gray-800/90 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-300 mb-4">
                  Service Appointments ({bookings.length})
                </h2>
                
                {loading ? (
                  <div className="text-center py-6">
                    <div className="animate-pulse flex justify-center">
                      <div className="h-6 w-6 bg-blue-500 rounded-full"></div>
                    </div>
                    <p className="text-gray-400 mt-4">Loading appointments...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-6">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <div className="grid grid-cols-7 gap-4 text-gray-400 font-semibold border-b border-gray-700 pb-2">
                      <div>ID</div>
                      <div>Vehicle</div>
                      <div>Service</div>
                      <div>Date</div>
                      <div>Time</div>
                      <div>Price</div>
                      <div>Status</div>
                      <div>Action</div>
                    </div>
                    {bookings.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="grid grid-cols-7 gap-4 py-3 border-b border-gray-700 items-center"
                      >
                        <div>#{appointment.id}</div>
                        <div>{appointment.vehicle}</div>
                        <div>{appointment.service}</div>
                        <div>{appointment.date}</div>
                        <div>{appointment.time}</div>
                        <div>${typeof appointment.price === 'number' ? appointment.price.toFixed(2) : appointment.price}</div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              appointment.status === "Pending"
                                ? "bg-yellow-100 text-yellow-600"
                                : appointment.status === "Confirmed"
                                ? "bg-green-100 text-green-600"
                                : appointment.status === "In Progress"
                                ? "bg-blue-100 text-blue-600"
                                : appointment.status === "Completed"
                                ? "bg-purple-100 text-purple-600"
                                : appointment.status === "Cancelled"
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                        <div>
                          <button
                            onClick={() => handleAppointmentAction(appointment)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">
                      No Appointments Found
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Schedule a service or repair for your vehicle to get started!
                    </p>
                    <button
                      onClick={() => navigate("/booking")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book a Service
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Profile Section */}
            {activeSection === "profile" && <UserProfile />}

            {/* Favorites Section */}
            {activeSection === "favorites" && <Favorites />}

            {/* Reminders Section */}
            {activeSection === "reminders" && (
              <div className="bg-gray-800/90 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-300 mb-4">Reminders</h2>
                {reminders.length > 0 ? (
                  <div className="space-y-4">
                    {reminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className="flex justify-between items-center border-b border-gray-700 pb-2"
                      >
                        <div>
                          <p className="text-gray-200 font-medium">{reminder.message}</p>
                          <p className="text-gray-400 text-sm">Due: {reminder.date}</p>
                        </div>
                        <button
                          onClick={() => handleReminderAction(reminder)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">
                      No Reminders
                    </h3>
                    <p className="text-gray-400">
                      Schedule a service to set reminders for your vehicle maintenance!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default UserDash;