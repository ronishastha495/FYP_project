import React, { useState } from 'react';
// import Header from '../components/Header'; // Reusable header component (assumed)
// import Footer from '../components/Footer'; // Reusable footer component (assumed)
// import AppointmentItem from '../components/AppointmentItem';

const UserDashboard = () => {
  // State to manage appointments (sample data for now)
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: '2023-06-15',
      time: '10:00 AM',
      serviceType: 'Oil Change',
      carModel: 'Toyota Camry',
    },
    {
      id: 2,
      date: '2023-06-20',
      time: '2:00 PM',
      serviceType: 'Tire Rotation',
      carModel: 'Honda Civic',
    },
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-grow container mx-auto p-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Upcoming Appointments</h2>
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <AppointmentItem key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <p className="text-gray-600">You have no upcoming appointments.</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserDashboard;