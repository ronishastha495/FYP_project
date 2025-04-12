// components/BookingList.jsx
import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import background from '../../assets/background.jpg';

const BookingList = ({ bookings, onViewBooking }) => {
  // Group bookings by status
  const groupedBookings = bookings.reduce((acc, booking) => {
    const status = booking.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(booking);
    return acc;
  }, {});

  // Order for displaying statuses
  const statusOrder = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

  // Status display names and styling
  const statusConfig = {
    pending: {
      label: 'Pending',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200'
    },
    confirmed: {
      label: 'Confirmed',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200'
    },
    in_progress: {
      label: 'In Progress',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-200'
    },
    completed: {
      label: 'Completed',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200'
    },
    cancelled: {
      label: 'Cancelled',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-200'
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow relative">
        <div 
          className="fixed inset-0 bg-cover bg-center blur-sm -z-10"
          style={{ backgroundImage: `url(${background})` }}
        />
        <div className="container mx-auto px-4 py-8 relative z-10">
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No bookings found. Schedule your first service or purchase inquiry.
            </div>
          ) : (
            <div>
              {statusOrder.map(status => {
                if (!groupedBookings[status] || groupedBookings[status].length === 0) return null;
                
                const config = statusConfig[status];
                
                return (
                  <div key={status} className="mb-6">
                    <h3 className={`text-lg font-medium mb-3 ${config.textColor}`}>
                      {config.label} ({groupedBookings[status].length})
                    </h3>
                    <div className="space-y-3">
                      {groupedBookings[status].map(booking => (
                        <div 
                          key={booking.id} 
                          className={`border rounded-lg p-4 ${config.borderColor} ${config.bgColor} cursor-pointer hover:opacity-90 transition-opacity`}
                          onClick={() => onViewBooking(booking)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">
                                {booking.booking_type === 'servicing' 
                                  ? booking.primary_service?.name || 'Vehicle Service' 
                                  : 'Vehicle Purchase Inquiry'}
                              </p>
                              <p className="text-sm text-gray-700">
                              {booking.vehicle_details
                                ? `${booking.vehicle_details.make || 'Vehicle'} ${booking.vehicle_details.model || 'model placeholder'} ${booking.vehicle_details.year ? `(${booking.vehicle_details.year})` : ''}`
                                : 'Vehicle Info Unavailable'}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {new Date(booking.date).toLocaleDateString()} at {booking.time}
                              </p>
                            </div>
                            <div className="text-right">
                              {booking.booking_type === 'servicing' && (
                                <p className="font-medium">${booking.final_cost}</p>
                              )}
                              <span className={`text-xs px-2 py-1 rounded-full ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
                                {config.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingList;