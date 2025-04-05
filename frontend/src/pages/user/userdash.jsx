// src/pages/user/UserDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext"; // Assuming you have a UserContext

const UserDash = () => {
  const { user, appointments, loading, error } = useUser();
  const navigate = useNavigate();

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-2xl font-semibold text-gray-600">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {appointments ? appointments.length : 'No'} Appointments Found
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm0 2h8v2H6V4zm0 4h8v8H6V8z" />
            </svg>
            <span className="text-gray-600">31 Jul 2020 - 03 Aug 2020</span>
          </div>
          <div className="flex items-center space-x-2">
            <img
              src="https://via.placeholder.com/40"
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-gray-600">{user?.name || "User"}</span>
          </div>
        </div>
      </div>

      {/* Appointments Section */}
      {appointments?.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="grid grid-cols-6 gap-4 text-gray-600 font-semibold border-b pb-2">
            <div>ID</div>
            <div>Name</div>
            <div>Service</div>
            <div>Date</div>
            <div>Price</div>
            <div>Status</div>
          </div>
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="grid grid-cols-6 gap-4 py-3 border-b items-center"
            >
              <div>#{appointment.id}</div>
              <div className="flex items-center space-x-2">
                <img
                  src={appointment.userImage || "https://via.placeholder.com/40"}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <span>{appointment.userName}</span>
              </div>
              <div>{appointment.service}</div>
              <div>{appointment.date}</div>
              <div>${appointment.price}</div>
              <div>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    appointment.status === "Pending"
                      ? "bg-red-100 text-red-600"
                      : appointment.status === "Completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Appointments Found
          </h2>
          <p className="text-gray-600 mb-4">
            It looks like you haven't booked any appointments yet. Let's get started!
          </p>
          <button
            onClick={() => navigate("/booking")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book an Appointment
          </button>
        </div>
      )}
      </div>
      <Footer />
    </div>
  );
};

export default UserDash;