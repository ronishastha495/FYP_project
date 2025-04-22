import React, { useState, useEffect } from "react";
import { useManager } from "../../contexts/ManagerContext";
import { toast } from "react-toastify";
import nepalCities from "../../utils/nepalCities";

const AddVehicles = () => {
  const {
    vehicles,
    addNewVehicle,
    updateExistingVehicle,
    deleteExistingVehicle,
  } = useManager();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 5;

  const [vehicleForm, setVehicleForm] = useState({
    make: "",
    model: "",
    year: "",
    vin: "",
    image: null,
    city: "",
    editingId: null,
  });

  const totalVehicles = vehicles?.length || 0;
  const totalPages = Math.ceil(totalVehicles / vehiclesPerPage);

  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = vehicles?.slice(indexOfFirstVehicle, indexOfLastVehicle) || [];

  useEffect(() => {
    if (vehicleForm.editingId) {
      const vehicle = vehicles.find((v) => v.vehicle_id === vehicleForm.editingId);
      if (vehicle) {
        setVehicleForm({
          make: vehicle.make || "",
          model: vehicle.model || "",
          year: vehicle.year || "",
          vin: vehicle.vin || "",
          image: null,
          city: vehicle.city || "",
          editingId: vehicle.vehicle_id,
        });
      }
    } else {
      setVehicleForm({
        make: "",
        model: "",
        year: "",
        vin: "",
        image: null,
        city: "",
        editingId: null,
      });
    }
  }, [vehicleForm.editingId, vehicles]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setVehicleForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
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

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError, { position: "top-right", autoClose: 3000 });
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

      if (vehicleForm.editingId) {
        await updateExistingVehicle(vehicleForm.editingId, formData);
        toast.success("Vehicle updated successfully!");
      } else {
        await addNewVehicle(formData);
        toast.success("Vehicle added successfully!");
      }
      setVehicleForm({
        make: "",
        model: "",
        year: "",
        vin: "",
        image: null,
        city: "",
        editingId: null,
      });
      setCurrentPage(1);
    } catch (error) {
      const errorMessage = error.message || "Failed to save vehicle";
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setVehicleForm((prev) => ({ ...prev, editingId: id }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteExistingVehicle(id);
        toast.success("Vehicle deleted successfully!");
        if (vehicleForm.editingId === id) {
          setVehicleForm({
            make: "",
            model: "",
            year: "",
            vin: "",
            image: null,
            city: "",
            editingId: null,
          });
        }
      } catch (error) {
        toast.error(error.message || "Failed to delete vehicle");
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
      <div className="max-w-4xl mx-auto">
        {/* Header with decorative accent */}
        <div className="relative mb-8">
          <h2 className="text-2xl font-bold text-indigo-700">Vehicle Management</h2>
          <div className="h-1 w-24 bg-indigo-500 rounded-full mt-2"></div>
        </div>

        {/* Vehicles List Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Available Vehicles</h3>
            <div className="h-px flex-1 bg-gray-200 mx-4"></div>
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
              {totalVehicles} Vehicles
            </span>
          </div>

          {currentVehicles.length > 0 ? (
            <div className="space-y-4">
              {currentVehicles.map((vehicle) => (
                <div
                  key={vehicle.vehicle_id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between p-5">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {vehicle.image && (
                          <div className="h-12 w-12 rounded-lg overflow-hidden mr-4 bg-indigo-50 border border-indigo-100 flex-shrink-0">
                            <img
                              src={vehicle.image}
                              alt={`${vehicle.make} ${vehicle.model}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <h4 className="font-semibold text-lg text-indigo-800">{`${vehicle.make} ${vehicle.model}`}</h4>
                      </div>
                      <p className="text-gray-600 mb-3">Year: {vehicle.year}</p>
                      <p className="text-gray-600 mb-3">VIN: {vehicle.vin}</p>
                      <p className="text-gray-600">City: {vehicle.city}</p>
                    </div>
                    <div className="flex space-x-3 mt-4 md:mt-0">
                      <button
                        onClick={() => handleEdit(vehicle.vehicle_id)}
                        className="px-4 py-2 bg-amber-500 text-white rounded-md text-sm hover:bg-amber-600 transition-colors duration-200 flex items-center shadow hover:shadow-md"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.vehicle_id)}
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
              <p className="mt-4 text-gray-500">No vehicles available yet.</p>
              <p className="text-sm text-gray-400 mt-2">Add your first vehicle using the form below.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalVehicles > vehiclesPerPage && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                } transition-all duration-200 shadow hover:shadow-md`}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      currentPage === pageNumber
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transition-all duration-200`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                } transition-all duration-200 shadow hover:shadow-md`}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {vehicleForm.editingId ? "Edit Vehicle" : "Add New Vehicle"}
            </h3>
            {vehicleForm.editingId && (
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
                <label className="block text-sm font-medium text-gray-700">Make</label>
                <input
                  name="make"
                  placeholder="Enter vehicle make (e.g., Toyota)"
                  value={vehicleForm.make}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <input
                  name="model"
                  placeholder="Enter vehicle model (e.g., Corolla)"
                  value={vehicleForm.model}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  disabled={loading}
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  name="year"
                  type="number"
                  placeholder="Enter year"
                  value={vehicleForm.year}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">VIN</label>
                <input
                  name="vin"
                  placeholder="Enter VIN (17 characters)"
                  value={vehicleForm.vin}
                  onChange={handleChange}
                  maxLength={17}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  disabled={loading}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">City</label>
              <select
                name="city"
                value={vehicleForm.city}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
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
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Vehicle Image</label>
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
              {vehicleForm.image && (
                <p className="text-sm text-green-600 mt-1">File selected: {vehicleForm.image.name}</p>
              )}
            </div>
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-4 ${vehicleForm.editingId ? 'bg-amber-600' : 'bg-indigo-600'} text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {vehicleForm.editingId ? "Updating..." : "Adding..."}
                  </span>
                ) : (
                  <span>{vehicleForm.editingId ? "Update Vehicle" : "Add Vehicle"}</span>
                )}
              </button>
              {vehicleForm.editingId && (
                <button
                  type="button"
                  onClick={() => setVehicleForm({
                    make: "",
                    model: "",
                    year: "",
                    vin: "",
                    image: null,
                    city: "",
                    editingId: null,
                  })}
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

export default AddVehicles;