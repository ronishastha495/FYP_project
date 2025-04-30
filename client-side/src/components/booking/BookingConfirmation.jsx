import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookingConfirmation = ({ booking, onClose }) => {
  console.log('Booking Confirmation:', booking); // Debugging: Check booking data
  if (!booking) {
    toast.error('No booking data available');
    return null;
  }

  const formatDateTime = () => {
    if (!booking?.data?.date || !booking?.data?.time) return 'N/A';
    const date = new Date(booking.data.date);
    const [hours, minutes] = booking.data.time.split(':');
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleString();
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full bg-opacity-90 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="bg-green-100 p-4 rounded-full inline-block mb-3">
            <svg
              className="h-16 w-16 text-green-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h2>
          <p className="text-gray-600 mt-2">Your appointment has been scheduled successfully.</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-lg mb-3">Booking Details</h3>
          <div className="space-y-2">
            
            <p>
              <span className="font-medium">Type:</span>{' '}
              {booking?.data?.type === 'Vehicle Service Booking' ? 'Vehicle Servicing' : 'Vehicle Purchase Inquiry'}
            </p>
            <p>
              <span className="font-medium">Vehicle:</span>{' '}
              {booking.vehicle
                ? `${booking?.data?.vehicle.make || 'N/A'} ${booking?.data?.vehicle.model || ''} ${
                    booking?.data?.vehicle.year ? `(${booking?.data?.vehicle.year})` : ''
                  }`
                : 'N/A'}
            </p>
            <p>
              <span className="font-medium">Date & Time:</span> {formatDateTime()}
            </p>
            <p>
              <span className="font-medium">Status:</span>{' '}
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  booking.data?.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : booking.data.status === 'confirmed'
                    ? 'bg-blue-100 text-blue-800'
                    : booking.data.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {(booking.data.status || 'pending').charAt(0).toUpperCase() +
                  (booking.data.status || 'pending').slice(1)}
              </span>
            </p>
            {booking.data.type === 'Vehicle Service Booking' && (
              <p>
                <span className="font-medium">Service:</span> {booking.data.service?.name || 'N/A'}
              </p>
            )}
            <p>
              <span className="font-medium">Total Price:</span> ${booking.data.total_price || 'N/A'}
            </p>
            {booking.data.notes && (
              <p>
                <span className="font-medium">Notes:</span> {booking.data.notes}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <Link
            to={`/tracking/${booking.data.booking_id}`}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Track Booking
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;