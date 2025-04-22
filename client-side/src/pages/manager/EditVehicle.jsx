import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useManager } from '../../contexts/ManagerContext';
import { api } from '../../api/serviceManager'; 
import { toast } from 'react-toastify';

const EditVehicle = () => {
  const { vehicleId } = useParams();
  const { vehicles, updateExistingVehicle } = useManager();
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const vehicle = vehicles.find(v => v.vehicle_id === vehicleId);
    if (vehicle) {
      setFormData({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        price: vehicle.price,
        discount: vehicle.discount,
        description: vehicle.description
      });
    }
  }, [vehicleId, vehicles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateExistingVehicle(vehicleId, formData);
      navigate('/manager/vehicles');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update vehicle');
    }
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Vehicle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields similar to AddVehicle with existing values */}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Vehicle
        </button>
      </form>
    </div>
  );
};

export default EditVehicle;
