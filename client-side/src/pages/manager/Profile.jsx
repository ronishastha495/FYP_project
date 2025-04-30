import React, { useState } from "react";
import { toast } from "react-toastify";
import { updateProfile } from "../../api/userApi";

const Profile = ({ profile }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    service_center_name: profile?.service_center_name || "",
    experience_years: profile?.experience_years || "",
    location: profile?.location || "",
    contact_number: profile?.contact_number || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!formData.service_center_name.trim()) return "Service center manager name is required";
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
      toast.error(validationError, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const updated = await updateProfile(formData);
      if (updated) {
        setSuccess("Profile updated successfully!");
        toast.success("Profile updated successfully! 👤", {
          position: "top-right",
          autoClose: 3000,
        });
        setIsEditing(false);
      } else {
        throw new Error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      let errorMessage = "Failed to update profile";
      if (error.message.includes("Network Error")) {
        errorMessage = "Network connection issue. Please check your internet connection and try again.";
      } else if (error.message.includes("Session expired")) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.message || "Invalid profile data. Please check your inputs.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setError("");
    setSuccess("");
  };

  return (
    <div className="bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Profile Overview</h2>
          <button
            onClick={toggleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}
        {success && <div className="p-3 mb-4 text-green-700 bg-green-100 rounded-lg">{success}</div>}

        {!isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ProfileCard
              title="Service Center Manager"
              value={profile?.service_center_name || "Damak Service Center"}
            />
            <ProfileCard
              title="Experience (Years)"
              value={profile?.experience_years || "9"}
            />
            <ProfileCard title="Location" value={profile?.location || "Damak"} />
            <ProfileCard
              title="Contact Number"
              value={profile?.contact_number || "9801713452"}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Service Center Manager Name
              </label>
              <input
                name="service_center_name"
                placeholder="Service Center Manager Name"
                value={formData.service_center_name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Experience (Years)
              </label>
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                name="contact_number"
                placeholder="Contact Number"
                value={formData.contact_number}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full p-3 text-white rounded-lg transition duration-300 ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const ProfileCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
    <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
    <p className="text-xl font-bold text-blue-600">{value}</p>
  </div>
);

export default Profile;