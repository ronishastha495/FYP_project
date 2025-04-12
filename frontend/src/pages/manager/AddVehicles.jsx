import React, { useState } from "react";
import { useManager } from "../../contexts/ManagerContext";
import { toast } from "react-toastify";
import nepalCities from "../../utils/nepalCities";

const AddVehicles = () => {
  const { vehicles, addNewVehicle } = useManager();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const vehiclesPerPage = 5; // Number of vehicles per page

  const [vehicleForm, setVehicleForm] = useState({
    make: "",
    model: "",
    year: "",
    vin: "",
    image: null,
    city: "",
  });

  // Calculate total pages
  const totalVehicles = vehicles?.length || 0;
  const totalPages = Math.ceil(totalVehicles / vehiclesPerPage);

  // Get the vehicles for the current page
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = vehicles?.slice(indexOfFirstVehicle, indexOfLastVehicle) || [];

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setVehicleForm({
      ...vehicleForm,
      [name]: files ? files[0] : value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!vehicleForm.make.trim()) return "Make is required";
    if (!vehicleForm.model.trim()) return "Model is required";
    if (!vehicleForm.year.trim()) return "Year is required";
    if (!vehicleForm.vin.trim()) return "VIN is required";
    if (vehicleForm.vin.trim().length !== 17) return "VIN must be 17 characters";
    if (!vehicleForm.city) return "City is required";
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      const formData = new FormData();
      formData.append("make", vehicleForm.make);
      formData.append("model", vehicleForm.model);
      formData.append("year", vehicleForm.year);
      formData.append("vin", vehicleForm.vin);
      formData.append("city", vehicleForm.city);
      if (vehicleForm.image) {
        formData.append("image", vehicleForm.image);
      }

      await addNewVehicle(formData);
      toast.success("🚗 Vehicle added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setVehicleForm({ make: "", model: "", year: "", vin: "", image: null, city: "" });
      // Reset to the first page after adding a new vehicle to see the updated list
      setCurrentPage(1);
    } catch (error) {
      const errorMessage = error.message || "Failed to add vehicle";
      setError(errorMessage);
      toast.error("Failed to add vehicle ❌", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="vehicles" className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Vehicles ({totalVehicles})</h3>
      <div className="grid gap-4 mb-6">
        {currentVehicles.length > 0 ? (
          currentVehicles.map((vehicle) => (
            <div key={vehicle.id} className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-gray-700">{`${vehicle.make} ${vehicle.model} (${vehicle.year})`}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No vehicles available.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalVehicles > vehiclesPerPage && (
        <div className="flex justify-center items-center space-x-2 mb-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition duration-300`}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === pageNumber
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition duration-300`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition duration-300`}
          >
            Next
          </button>
        </div>
      )}

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
        <select
          name="city"
          value={vehicleForm.city}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          required
        >
          <option value="">Select City</option>
          {nepalCities.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
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
          className={`w-full p-3 text-white rounded-lg transition duration-300 ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Adding Vehicle..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
};

export default AddVehicles;