import React, { useState } from "react";
import { useManager } from "../../contexts/ManagerContext";

const AddVehicles = () => {
  const { vehicles, addNewVehicle } = useManager();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [vehicleForm, setVehicleForm] = useState({
    make: "",
    model: "",
    year: "",
    vin: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setVehicleForm({
      ...vehicleForm,
      [name]: files ? files[0] : value
    });
    setError("");
  };

  const validateForm = () => {
    if (!vehicleForm.make.trim()) return "Make is required";
    if (!vehicleForm.model.trim()) return "Model is required";
    if (!vehicleForm.year.trim()) return "Year is required";
    if (!vehicleForm.vin.trim()) return "VIN is required";
    if (vehicleForm.vin.trim().length !== 17) return "VIN must be 17 characters";
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
      await addNewVehicle(vehicleForm);
      setSuccess("Vehicle added successfully!");
      setVehicleForm({ make: "", model: "", year: "", vin: "", image: null });
    } catch (error) {
      setError(error.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="vehicles" className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Vehicles ({vehicles.length})</h3>
      <div className="grid gap-4 mb-6">
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <div key={vehicle.id} className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-gray-700">{`${vehicle.make} ${vehicle.model} (${vehicle.year})`}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No vehicles available.</p>
        )}
      </div>
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Add New Vehicle</h4>
      {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}
      {success && <div className="p-3 mb-4 text-green-700 bg-green-100 rounded-lg">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          name="make"
          placeholder="Make (e.g., Toyota)"
          value={vehicleForm.make}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          required
        />
        <input
          name="model"
          placeholder="Model (e.g., Corolla)"
          value={vehicleForm.model}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          required
        />
        <input
          name="year"
          placeholder="Year"
          type="number"
          value={vehicleForm.year}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          required
        />
        <input
          name="vin"
          placeholder="VIN (17 characters)"
          value={vehicleForm.vin}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          maxLength={17}
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
          {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
        </button>
      </form>
    </div>
  );
};

export default AddVehicles;
