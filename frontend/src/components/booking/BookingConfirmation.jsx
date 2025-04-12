import React from 'react';
import { Link } from 'react-router-dom';
import background from '../../assets/background.jpg';

const BookingConfirmation = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div 
        className="fixed inset-0 bg-cover bg-center blur-sm -z-10"
        style={{ backgroundImage: `url(${background})` }}
      />
      <div className="bg-white rounded-lg p-6 max-w-md w-full bg-opacity-90 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="bg-green-100 p-4 rounded-full inline-block mb-3">
            <svg className="h-16 w-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h2>
          <p className="text-gray-600 mt-2">Your appointment has been scheduled successfully.</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-lg mb-3">Booking Details</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Booking ID:</span> {booking.id}</p>
            <p><span className="font-medium">Type:</span> {booking.type === 'servicing' ? 'Vehicle Servicing' : 'Vehicle Purchase'}</p>
            <p><span className="font-medium">Date & Time:</span> {new Date(booking.scheduled_at).toLocaleString()}</p>
            <p><span className="font-medium">Status:</span> <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Confirmed</span></p>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Link 
            to="/tracking" 
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