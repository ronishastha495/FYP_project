import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVehicles } from '../redux/features/vehicleSlice';

const VehicleList = () => {
  const dispatch = useDispatch();
  const vehicles = useSelector((state) => state.vehicles);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Vehicles</h2>
      <ul className="space-y-2">
        {vehicles.map((vehicle) => (
          <li key={vehicle.id} className="p-4 bg-white shadow rounded">
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VehicleList;