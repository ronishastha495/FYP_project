// src/pages/user/UserProfile.jsx
import React, { useState } from "react";
// import { useUser } from "../../contexts/UserContext";

const UserProfile = () => {
  const { user, updateProfile, loading } = useUser(); // Mock context data
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-2xl font-semibold text-gray-600">Loading...</div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Edit Profile
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Service History / Favorites */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Service History
          </h2>
          {user?.serviceHistory?.length > 0 ? (
            <ul className="space-y-3">
              {user.serviceHistory.map((service, index) => (
                <li key={index} className="border-b py-2">
                  <div className="flex justify-between">
                    <span>{service.name}</span>
                    <span>{service.date}</span>
                  </div>
                  <div className="text-gray-600 text-sm">{service.price}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No service history available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;