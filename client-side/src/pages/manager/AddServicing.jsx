import React, { useState, useEffect } from "react";
import { useManager } from "../../contexts/ManagerContext";
import { toast } from "react-toastify";

const AddServicing = () => {
  const {
    services,
    addNewService,
    updateExistingService,
    deleteExistingService,
  } = useManager();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    cost: "",
    discount: "",
    image: null,
  });

  useEffect(() => {
    if (editingId) {
      const service = services.find((s) => s.service_id === editingId);
      if (service) {
        setServiceForm({
          name: service.name || "",
          description: service.description || "",
          cost: service.cost || "",
          discount: service.discount || "",
          image: null,
        });
      }
    } else {
      setServiceForm({
        name: "",
        description: "",
        cost: "",
        discount: "",
        image: null,
      });
    }
  }, [editingId, services]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setServiceForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (!serviceForm.name.trim()) return "Service name is required";
    if (!serviceForm.cost.toString().trim()) return "Service cost is required";
    if (isNaN(serviceForm.cost) || parseFloat(serviceForm.cost) <= 0) {
      return "Please enter a valid cost";
    }
    if (
      serviceForm.discount &&
      (isNaN(serviceForm.discount) || parseFloat(serviceForm.discount) < 0)
    ) {
      return "Please enter a valid discount";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError, { position: "top-right", autoClose: 3000 });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(serviceForm).forEach(([key, val]) => {
        if (val !== null && val !== "") {
          formData.append(key, val);
        }
      });

      if (editingId) {
        await updateExistingService(editingId, formData);
        toast.success("Service updated successfully!");
      } else {
        await addNewService(formData);
        toast.success("Service added successfully!");
      }
      setEditingId(null);
      setServiceForm({
        name: "",
        description: "",
        cost: "",
        discount: "",
        image: null,
      });
    } catch (err) {
      const msg = err.message || "Failed to save service";
      setError(msg);
      toast.error(msg, { position: "top-right", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteExistingService(id);
        toast.success("Service deleted successfully!");
        if (editingId === id) {
          setEditingId(null);
        }
      } catch (error) {
        toast.error(error.message || "Failed to delete service");
      }
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
      <div className="max-w-4xl mx-auto">
        {/* Header with decorative accent */}
        <div className="relative mb-8">
          <h2 className="text-2xl font-bold text-indigo-700">
            Service Management
          </h2>
          <div className="h-1 w-24 bg-indigo-500 rounded-full mt-2"></div>
        </div>

        {/* Services List Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Available Services</h3>
            <div className="h-px flex-1 bg-gray-200 mx-4"></div>
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
              {services?.length || 0} Services
            </span>
          </div>

          {services?.length > 0 ? (
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.service_id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between p-5">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {service.image && (
                          <div className="h-12 w-12 rounded-lg overflow-hidden mr-4 bg-indigo-50 border border-indigo-100 flex-shrink-0">
                            <img 
                              src={service.image} 
                              alt={service.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <h4 className="font-semibold text-lg text-indigo-800">{service.name}</h4>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{service.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="px-3 py-1 bg-blue-50 rounded-full text-blue-700 font-medium">
                          Rs. {typeof service.cost === "number" 
                            ? service.cost.toFixed(2) 
                            : parseFloat(service.cost).toFixed(2)
                          }
                        </div>
                        
                        {service.discount > 0 && (
                          <div className="px-3 py-1 bg-green-50 rounded-full text-green-700 font-medium">
                            {service.discount}% Off
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 mt-4 md:mt-0">
                      <button
                        onClick={() => handleEdit(service.service_id)}
                        className="px-4 py-2 bg-amber-500 text-white rounded-md text-sm hover:bg-amber-600 transition-colors duration-200 flex items-center shadow hover:shadow-md"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.service_id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors duration-200 flex items-center shadow hover:shadow-md"
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
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <p className="mt-4 text-gray-500">No services available yet.</p>
              <p className="text-sm text-gray-400 mt-2">Add your first service using the form below.</p>
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {editingId ? "Edit Service" : "Add New Service"}
            </h3>
            {editingId && (
              <span className="ml-3 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                Editing Mode
              </span>
            )}
          </div>
          
          {error && (
            <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
              <div className="flex">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Service Name</label>
                <input
                  name="name"
                  placeholder="Enter service name"
                  value={serviceForm.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Service Cost (Rs.)</label>
                <input
                  name="cost"
                  type="number"
                  step="0.01"
                  placeholder="Enter cost amount"
                  value={serviceForm.cost}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  disabled={loading}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                placeholder="Enter service description"
                value={serviceForm.description}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
              <input
                name="discount"
                type="number"
                step="0.01"
                placeholder="Enter discount percentage (optional)"
                value={serviceForm.discount}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Service Image</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, or GIF (recommended)</p>
                  </div>
                  <input 
                    type="file" 
                    name="image" 
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden" 
                    disabled={loading}
                  />
                </label>
              </div>
              {serviceForm.image && (
                <p className="text-sm text-green-600 mt-1">File selected: {serviceForm.image.name}</p>
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
                    {editingId ? "Updating..." : "Adding..."}
                  </span>
                ) : (
                  <span>{editingId ? "Update Service" : "Add Service"}</span>
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
      </div>
    </div>
  );
};

export default AddServicing;