import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <aside className="fixed top-16 left-0 w-64 h-full bg-white shadow-lg p-4">
      <ul className="space-y-4">
        <li><button onClick={() => navigate('/dashboard')} className="w-full text-left text-blue-600 hover:bg-blue-100 p-2 rounded">Dashboard</button></li>
        <li><button onClick={() => navigate('/vehicles')} className="w-full text-left text-blue-600 hover:bg-blue-100 p-2 rounded">My Vehicles</button></li>
        <li><button onClick={() => navigate('/bookings')} className="w-full text-left text-blue-600 hover:bg-blue-100 p-2 rounded">Bookings</button></li>
        <li><button onClick={() => navigate('/reminders')} className="w-full text-left text-blue-600 hover:bg-blue-100 p-2 rounded">Reminders</button></li>
      </ul>
    </aside>
  );
};

export default Sidebar;