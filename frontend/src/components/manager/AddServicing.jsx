import React, { useState } from "react";
import { useManager } from "../../contexts/ManagerContext";

const AddServicing = () => {
  const { services, addNewService } = useManager();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    cost: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setServiceForm({
      ...serviceForm,
      [name]: files ? files[0] : value
    });
    setError("");
  };

  const validateForm = () => {
    if (!serviceForm.name.trim()) return "Service name is required";
    if (!serviceForm.cost.trim()) return "Service cost is required";
    if (isNaN(serviceForm.cost) || parseFloat(serviceForm.cost) <= 0) {
      return "Please enter a valid cost";
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      for (const key in serviceForm) {
        if (serviceForm[key] !== null) {
          formData.append(key, serviceForm[key]);
        }
      }
      await addNewService(formData);
      setSuccess("Service added successfully!");
      setServiceForm({ name: "", description: "", cost: "", image: null });
    } catch (error) {
      setError(error.message || "Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="servicing" className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Services ({services.length})</h3>
      <div className="grid gap-4 mb-6">
        {services.length > 0 ? (
          services.map((service) => (
            <div key={service.id} className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-gray-700">{service.name}</p>
              <p className="text-gray-600">{service.description}</p>
              <p className="text-blue-600 font-semibold">Rs. {service.cost}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No services available.</p>
        )}
      </div>
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Add New Service</h4>
      {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}
      {success && <div className="p-3 mb-4 text-green-700 bg-green-100 rounded-lg">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          name="name"
          placeholder="Service Name"
          value={serviceForm.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          required
        />
        <textarea
          name="description"
          placeholder="Service Description"
          value={serviceForm.description}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <input
          name="cost"
          type="number"
          step="0.01"
          placeholder="Service Cost"
          value={serviceForm.cost}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          required
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          accept="image/*"
        />
        <button
          type="submit"
          className={`w-full p-3 text-white rounded-lg transition duration-300 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? 'Adding Service...' : 'Add Service'}
        </button>
      </form>
    </div>
  );
};

export default AddServicing;