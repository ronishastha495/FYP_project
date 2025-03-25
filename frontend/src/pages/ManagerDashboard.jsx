// ServiceManagerDashboard.jsx
import React, { useState } from 'react';

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');

  // Sample data (in real app, this would come from an API)
  const appointments = [
    { id: 1, customer: 'John Doe', service: 'Haircut', time: '10:00 AM', date: '2025-03-24', status: 'Pending' },
    { id: 2, customer: 'Jane Smith', service: 'Manicure', time: '2:00 PM', date: '2025-03-24', status: 'Confirmed' },
  ];

  const services = [
    { id: 1, name: 'Haircut', price: 30, duration: '45min' },
    { id: 2, name: 'Manicure', price: 25, duration: '30min' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Service Manager Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['appointments', 'services', 'customers'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="mt-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Appointments</h3>
                <div className="grid gap-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-md font-semibold">{appointment.customer}</h4>
                          <p className="text-sm text-gray-600">{appointment.service}</p>
                          <p className="text-sm text-gray-500">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                        <div className="space-x-2">
                          <button className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                            Chat
                          </button>
                          <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700">
                            Remind
                          </button>
                          <button className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                            Feedback
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="mt-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Available Services</h3>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Add New Service
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="text-md font-semibold">{service.name}</h4>
                      <p className="text-sm text-gray-600">${service.price}</p>
                      <p className="text-sm text-gray-500">{service.duration}</p>
                      <div className="mt-2 space-x-2">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          Edit
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="mt-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Management</h3>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    View All Customers
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Send Bulk Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;