import React from 'react';
import { useAuth } from '../contexts/useAuth';
import { getVehicles } from '../endpoints/api';

const Vehicles = () => {
  const { isAuthenticated } = useAuth();
  const [vehicles, setVehicles] = React.useState([]);

  React.useEffect(() => {
    if (isAuthenticated) {
      getVehicles()
        .then((data) => setVehicles(data))
        .catch((err) => console.error(err));
    }
  }, [isAuthenticated]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Vehicles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{vehicle.make} {vehicle.model}</h3>
            <p className="text-gray-600">{vehicle.year}</p>
            <p className="text-gray-600">{vehicle.vin}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;