import React, { useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import { toast } from "react-toastify";

const AppointmentHandling = ({ bookings }) => {
  const [appointmentList, setAppointmentList] = useState(bookings || []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axiosInstance.patch(`/bookings/${bookingId}/`, { status: newStatus });
      setAppointmentList(
        appointmentList.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
      toast.success("Appointment status updated successfully!");
    } catch (err) {
      console.error("Failed to update appointment status:", err);
      toast.error("Failed to update appointment status.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Appointments</h2>
      {appointmentList.length === 0 ? (
        <p className="text-gray-500 text-sm">No appointments available.</p>
      ) : (
        <div className="space-y-4">
          {appointmentList.map(booking => (
            <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-800">
                  Booking ID: {booking.id} • {booking.service ? "Service" : "Vehicle"} Booking
                </h3>
                <p className="text-sm text-gray-600">
                  Date: {booking.date} at {booking.time}
                </p>
                <p className="text-sm text-gray-600">Status: {booking.status}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                  className="text-blue-600 text-sm hover:underline"
                  disabled={booking.status === "confirmed"}
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                  className="text-red-600 text-sm hover:underline"
                  disabled={booking.status === "cancelled"}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentHandling;