import React from 'react';
import { useAuth } from '../contexts/useAuth';
import { getServiceHistory } from '../endpoints/api';

const ServiceHistory = () => {
  const { isAuthenticated } = useAuth();
  const [serviceHistory, setServiceHistory] = React.useState([]);

  React.useEffect(() => {
    if (isAuthenticated) {
      getServiceHistory()
        .then((data) => setServiceHistory(data))
        .catch((err) => console.error(err));
    }
  }, [isAuthenticated]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Service History</h2>
      <div className="space-y-4">
        {serviceHistory.map((history) => (
          <div key={history.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{history.service_type}</h3>
            <p className="text-gray-600">{history.service_date}</p>
            <p className="text-gray-600">Cost: ${history.cost}</p>
            <p className="text-gray-600">{history.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceHistory;