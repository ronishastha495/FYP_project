import React, { useState } from "react";

const Profile = ({ profile, updateProfile }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service_center_name: profile?.service_center_name || "",
    experience_years: profile?.experience_years || "",
    location: profile?.location || "",
    contact_number: profile?.contact_number || ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!formData.service_center_name.trim()) return "Service center name is required";
    if (!formData.experience_years) return "Experience years is required";
    if (isNaN(formData.experience_years) || parseInt(formData.experience_years) < 0) {
      return "Please enter a valid number of years";
    }
    if (!formData.location.trim()) return "Location is required";
    if (!formData.contact_number.trim()) return "Contact number is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const updated = await updateProfile(formData);
      if (updated) {
        setSuccess("Profile updated successfully!");
      } else {
        throw new Error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      let errorMessage = "Failed to update profile";
      if (error.message.includes('Network Error')) {
        errorMessage = "Network connection issue. Please check your internet connection and try again.";
      } else if (error.message.includes('Session expired')) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.message || "Invalid profile data. Please check your inputs.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="profile" className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h3>
      {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}
      {success && <div className="p-3 mb-4 text-green-700 bg-green-100 rounded-lg">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="service_center_name"
          placeholder="Service Center Name"
          value={formData.service_center_name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          required
        />
        <input
          name="experience_years"
          placeholder="Experience (Years)"
          type="number"
          value={formData.experience_years}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          required
        />
        <input
          name="contact_number"
          placeholder="Contact Number"
          value={formData.contact_number}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          required
        />
        <button
          type="submit"
          className={`w-full p-3 text-white rounded-lg transition duration-300 ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;