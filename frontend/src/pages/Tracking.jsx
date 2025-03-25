import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TrackingPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Dummy appointment data
  const appointments = [
    { id: 1, user: 'John Doe', service: 'Haircut', date: '2025-03-25', status: 'Pending' },
    { id: 2, user: 'Jane Smith', service: 'Massage', date: '2025-03-26', status: 'Confirmed' },
    { id: 3, user: 'Alex Brown', service: 'Spa', date: '2025-03-27', status: 'Completed' },
    { id: 4, user: 'Emily White', service: 'Nails', date: '2025-03-28', status: 'Pending' },
    { id: 5, user: 'Mike Green', service: 'Haircut', date: '2025-03-29', status: 'Confirmed' },
    { id: 6, user: 'Sarah Blue', service: 'Massage', date: '2025-03-30', status: 'Pending' },
  ];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-10 tracking-tight">
          Appointment Tracking
        </h2>

        {/* Appointment Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {currentAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{appointment.user}</h3>
              <p className="text-gray-600">
                <span className="font-medium">Service:</span> {appointment.service}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Date:</span> {appointment.date}
              </p>
              <p
                className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  appointment.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : appointment.status === 'Confirmed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {appointment.status}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
                  currentPage === i + 1
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-indigo-500 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TrackingPage;