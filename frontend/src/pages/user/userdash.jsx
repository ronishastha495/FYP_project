// src/pages/user/UserDash.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import backgroundImage from "../../assets/background.jpg"; // Adjust path to your image

const UserDash = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("appointments");

  // Dummy data for auto care context
  const [appointments] = useState([
    {
      id: 1,
      vehicle: "Toyota Camry",
      service: "Oil Change",
      date: "2024-10-05",
      price: 50,
      status: "Confirmed",
    },
    {
      id: 2,
      vehicle: "Honda Civic",
      service: "Brake Repair",
      date: "2024-10-07",
      price: 150,
      status: "Pending",
    },
  ]);

  const [profile, setProfile] = useState({
    name: "Ronisha Shrestha",
    email: "shrestharonisha@gmail.com",
    phone: "9834353434",
    address: "Damak",
    city: "Damak",
    country: "Nepal",
    profile_picture_url: "https://via.placeholder.com/100",
  });

  const [formData, setFormData] = useState({ ...profile });

  const [favorites] = useState([
    { id: 1, type: "Service", name: "Oil Change", description: "Regular maintenance" },
    { id: 2, type: "Vehicle", name: "Toyota Corolla", description: "2023 model, available for purchase" },
  ]);

  const [reminders] = useState([
    { id: 1, message: "Oil Change due for Toyota Camry", date: "2024-10-05" },
    { id: 2, message: "Tire Alignment check for Honda Civic", date: "2024-10-10" },
  ]);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfile(formData);
    alert("Profile updated successfully!");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate file upload
      const fakeUrl = URL.createObjectURL(file);
      setFormData({ ...formData, profile_picture_url: fakeUrl });
      setProfile({ ...profile, profile_picture_url: fakeUrl });
      alert("Profile picture updated!");
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
      {/* Semi-transparent overlay for readability */}
      <div className="min-h-screen flex flex-col bg-gray-900/70">
        {/* Top Navbar */}
        <Navbar />

        {/* Main Content */}
        <div className="flex-1 pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Oval Sub-Navigation */}
            <div className="bg-gray-800/90 rounded-full p-1 flex justify-around mb-8 shadow-md">
              <button
                onClick={() => setActiveSection("appointments")}
                className={`px-6 py-2 rounded-full text-sm font-semibold ${
                  activeSection === "appointments" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Appointments
              </button>
              <button
                onClick={() => setActiveSection("profile")}
                className={`px-6 py-2 rounded-full text-sm font-semibold ${
                  activeSection === "profile" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveSection("favorites")}
                className={`px-6 py-2 rounded-full text-sm font-semibold ${
                  activeSection === "favorites" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Favorites
              </button>
              <button
                onClick={() => setActiveSection("reminders")}
                className={`px-6 py-2 rounded-full text-sm font-semibold ${
                  activeSection === "reminders" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Reminders
              </button>
            </div>

            {/* Appointments Section */}
            {activeSection === "appointments" && (
              <div className="bg-gray-800/90 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-300 mb-4">
                  Service Appointments ({appointments.length})
                </h2>
                {appointments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <div className="grid grid-cols-5 gap-4 text-gray-400 font-semibold border-b border-gray-700 pb-2">
                      <div>ID</div>
                      <div>Vehicle</div>
                      <div>Service</div>
                      <div>Date</div>
                      <div>Price</div>
                      <div>Status</div>
                    </div>
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="grid grid-cols-5 gap-4 py-3 border-b border-gray-700 items-center"
                      >
                        <div>#{appointment.id}</div>
                        <div>{appointment.vehicle}</div>
                        <div>{appointment.service}</div>
                        <div>{appointment.date}</div>
                        <div>${appointment.price}</div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              appointment.status === "Pending"
                                ? "bg-red-100 text-red-600"
                                : appointment.status === "Confirmed"
                                ? "bg-green-100 text-green-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">No Appointments Found</h3>
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
            {activeSection === "profile" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Edit Profile Form */}
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
                        value={formData.phone}
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
                {/* Profile Display */}
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
                          src={profile.profile_picture_url}
                          alt="Profile"
                          className="w-32 h-32 rounded-lg object-cover"
                        />
                      ) : (
                        <p className="text-gray-200 font-medium">No photo</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Favorites Section */}
            {activeSection === "favorites" && (
              <div className="bg-gray-800/90 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-300 mb-4">Favorites</h2>
                {favorites.length > 0 ? (
                  <div className="space-y-4">
                    {favorites.map((favorite) => (
                      <div key={favorite.id} className="flex justify-between items-center border-b border-gray-700 pb-2">
                        <div>
                          <p className="text-gray-200 font-medium">{favorite.name} ({favorite.type})</p>
                          <p className="text-gray-400 text-sm">{favorite.description}</p>
                        </div>
                        <button
                          onClick={() =>
                            alert(
                              favorite.type === "Service"
                                ? `Book ${favorite.name} service`
                                : `View ${favorite.name} for purchase`
                            )
                          }
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
            )}

            {/* Reminders Section */}
            {activeSection === "reminders" && (
              <div className="bg-gray-800/90 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-300 mb-4">Reminders</h2>
                {reminders.length > 0 ? (
                  <div className="space-y-4">
                    {reminders.map((reminder) => (
                      <div key={reminder.id} className="flex justify-between items-center border-b border-gray-700 pb-2">
                        <div>
                          <p className="text-gray-200 font-medium">{reminder.message}</p>
                          <p className="text-gray-400 text-sm">Due: {reminder.date}</p>
                        </div>
                        <button
                          onClick={() => alert(`View details for ${reminder.message}`)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">No Reminders</h3>
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