import React, { useEffect, useState } from 'react';
import { useManager } from '../../contexts/ManagerContext';
import { Link } from 'react-router-dom';

const ServiceCenterList = () => {
  const { serviceCenters } = useManager();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {serviceCenters.map(center => (
        <div key={center.center_id} className="bg-white p-4 rounded-lg shadow">
          <img 
            src={center.center_logo} 
            alt={center.name} 
            className="h-32 w-full object-contain mb-4"
          />
          <h3 className="text-xl font-semibold">{center.name}</h3>
          <p className="text-gray-600 mb-2">{center.location}</p>
          <div className="flex justify-between text-sm">
            <span>Open: {center.open_time}</span>
            <span>Close: {center.close_time}</span>
          </div>
          <Link 
            to={`/manager/service-centers/${center.center_id}`}
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Manage Center
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ServiceCenterList;