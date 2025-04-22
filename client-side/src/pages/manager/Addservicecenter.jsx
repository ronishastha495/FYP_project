import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useManager } from "../../contexts/ManagerContext";
import axios from "axios";

const AddServiceCenter = () => {
  const {
    serviceCenters,
    addNewServiceCenter,
    updateExistingServiceCenter,
    deleteExistingServiceCenter,
  } = useManager();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    center_manager: "",
    center_logo: null,
  });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch service managers for center_manager dropdown
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/auth-app/api/service-managers/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        setManagers(res.data);
      } catch (err) {
        toast.error("Failed to fetch service managers");
      }
    };
    fetchManagers();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (editingId) {
      const center = serviceCenters.find((sc) => sc.center_id === editingId);
      if (center) {
        setFormData({
          name: center.name || "",
          description: center.description || "",
          location: center.location || "",
          center_manager: center.center_manager?.username || "",
          center_logo: null,
        });
      }
    } else {
      setFormData({
        name: "",
        description: "",
        location: "",
        center_manager: "",
        center_logo: null,
      });
    }
  }, [editingId, serviceCenters]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!formData.name || !formData.description || !formData.location || !formData.center_manager) {
      toast.error("All fields (Name, Description, Location, Center Manager) are required");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("center_manager", formData.center_manager);
      if (formData.center_logo) {
        data.append("center_logo", formData.center_logo);
      }

      // Debug: Log formData
      for (let pair of data.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      if (editingId) {
        await updateExistingServiceCenter(editingId, data);
        toast.success("Service center updated successfully!");
      } else {
        await addNewServiceCenter(data);
        toast.success("Service center added successfully!");
      }
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        location: "",
        center_manager: "",
        center_logo: null,
      });
    } catch (error) {
      toast.error(error.message || "Failed to save service center");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service center?")) {
      try {
        await deleteExistingServiceCenter(id);
        toast.success("Service center deleted successfully!");
        if (editingId === id) {
          setEditingId(null);
        }
      } catch (error) {
        toast.error(error.message || "Failed to delete service center");
      }
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
      <div className="max-w-4xl mx-auto">
        {/* Header with decorative accent */}
        <div className="relative mb-8">
          <h2 className="text-2xl font-bold text-indigo-700">
            {editingId ? "Edit Service Center" : "Add New Service Center"}
          </h2>
          <div className="h-1 w-24 bg-indigo-500 rounded-full mt-2"></div>
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 transition-all duration-300 hover:shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter center name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                placeholder="Enter detailed description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Center Manager</label>
              <select
                name="center_manager"
                value={formData.center_manager}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                disabled={loading}
              >
                <option value="">Select Manager</option>
                {managers.map((manager) => (
                  <option key={manager.username} value={manager.username}>
                    {manager.username}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Logo</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, or GIF (MAX. 800x400px)</p>
                  </div>
                  <input 
                    type="file" 
                    name="center_logo" 
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden" 
                    disabled={loading}
                  />
                </label>
              </div>
              {formData.center_logo && (
                <p className="text-sm text-green-600 mt-1">File selected: {formData.center_logo.name}</p>
              )}
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-4 ${editingId ? 'bg-amber-600' : 'bg-indigo-600'} text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span>{editingId ? "Update Service Center" : "Add Service Center"}</span>
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="flex-1 py-3 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Service Centers List Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Service Centers</h3>
            <div className="h-px flex-1 bg-gray-200 mx-4"></div>
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
              {serviceCenters.length} Centers
            </span>
          </div>

          {serviceCenters.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="mt-4 text-gray-500">No service centers available.</p>
              <p className="text-sm text-gray-400 mt-2">Add your first service center using the form above.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {serviceCenters.map((center) => (
                <div
                  key={center.center_id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 group"
                >
                  <div className="bg-indigo-50 p-4 flex items-center justify-between border-b border-gray-100">
                    <h4 className="font-semibold text-indigo-800 truncate group-hover:text-indigo-600">{center.name}</h4>
                    {center.center_logo && (
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-white shadow-sm">
                        <img src={center.center_logo} alt={`${center.name} logo`} className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-3 text-gray-600">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span className="text-sm">{center.location}</span>
                    </div>
                    {center.center_manager && (
                      <div className="flex items-center text-gray-600">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span className="text-sm">{center.center_manager.username}</span>
                      </div>
                    )}
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(center.center_id)}
                        className="px-3 py-1 bg-amber-500 text-white rounded-md text-sm hover:bg-amber-600 transition-colors duration-200 flex items-center"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(center.center_id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors duration-200 flex items-center"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddServiceCenter;