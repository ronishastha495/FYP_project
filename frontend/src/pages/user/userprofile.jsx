// src/pages/user/UserProfile.jsx
import React, { useState } from "react";
import { useUserProfile } from "../../contexts/UserProfileContext";

const UserProfile = () => {
  const { profile, updateProfile, uploadProfilePicture, loading, error } = useUserProfile();
  
  const [formData, setFormData] = useState({
    username: profile?.username || "",
    email: profile?.email || "",
    address: profile?.address || "",
    city: profile?.city || "",
    country: profile?.country || "",
    bio: profile?.bio || "",
    profile_picture: profile?.profile_picture_url || "",
    password: "" // Added password field
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await uploadProfilePicture(file);
      } catch (err) {
        console.error("Error uploading profile picture:", err);
      }
    }
  };

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
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex items-center">
              {profile?.profile_picture_url ? (
                <img 
                  src={profile.profile_picture_url} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                  <span className="text-gray-500">No photo</span>
                </div>
              )}
              <div className="flex-1">
                <label className="block text-gray-600 mb-2">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg bg-gray-100 focus:outline-none"
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg bg-gray-100 focus:outline-none"
                disabled
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

            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                rows="4"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>

        {/* Profile Display */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Username</p>
              <p className="text-gray-800 font-medium">{profile?.username || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="text-gray-800 font-medium">{profile?.email || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-gray-600">Address</p>
              <p className="text-gray-800 font-medium">{profile?.address || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-gray-600">City</p>
              <p className="text-gray-800 font-medium">{profile?.city || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-gray-600">Country</p>
              <p className="text-gray-800 font-medium">{profile?.country || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-gray-600">Bio</p>
              <p className="text-gray-800 font-medium">{profile?.bio || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-gray-600">Profile Picture</p>
              {profile?.profile_picture_url ? (
                <img 
                  src={profile.profile_picture_url} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-lg object-cover"
                />
              ) : (
                <p className="text-gray-800 font-medium">Not provided</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;