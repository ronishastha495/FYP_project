// pages/BookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../contexts/BookingContext';
import BookingForm from '../components/booking/bookingForm';
import BookingList from '../components/booking/bookingList';
import BookingConfirmation from '../components/booking/BookingConfirmation';
import { toast } from 'react-toastify';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
// import background from '../assets/background.jpg';

const BookingPage = () => {
  const { 
    bookings, 
    fetchBookings, 
    loading, 
    error, 
    selectedService, 
    selectedVehicle, 
    bookingType, 
    resetBookingSelection 
  } = useBooking();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch bookings when component mounts
    fetchBookings().catch(err => {
      toast.error('Failed to fetch bookings');
    });

    // If we have a selected service or vehicle, show the booking form
    if (selectedService || selectedVehicle) {
      setShowBookingForm(true);
    }

    // Cleanup function to reset selection when component unmounts
    return () => {
      resetBookingSelection();
    };
  }, []);

  const handleBookingSubmit = (newBooking) => {
    setShowBookingForm(false);
    fetchBookings();
    setConfirmedBooking(newBooking);
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseBookingDetails = () => {
    setSelectedBooking(null);
  };

  const handleCloseConfirmation = () => {
    setConfirmedBooking(null);
  };

  return (
    <div >
      <Navbar />
      <div className="container mx-auto px-4 py-8 bg-white bg-opacity-90 rounded-lg my-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Vehicle Services</h1>
        <button
          onClick={() => setShowBookingForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Book New Service
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-full lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
                {bookings && bookings.length > 0 ? (
                  <BookingList 
                    bookings={bookings} 
                    onViewBooking={handleViewBooking} 
                  />
                ) : (
                  <p className="text-gray-500">You don't have any bookings yet.</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-full lg:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Schedule Service</h2>
                <p className="text-gray-600 mb-4">
                  Book your next service appointment or purchase inquiry online.
                </p>
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Schedule Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBookingForm && (
        <BookingForm
          service={selectedService}
          vehicle={selectedVehicle}
          initialBookingType={bookingType}
          onClose={() => {
            setShowBookingForm(false);
            resetBookingSelection();
          }}
          onSubmit={handleBookingSubmit}
        />
      )}

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={handleCloseBookingDetails}
        />
      )}

      {confirmedBooking && (
        <BookingConfirmation 
          booking={confirmedBooking}
          onClose={handleCloseConfirmation}
        />
      )}
      </div>
      <Footer />
    </div>
  );
};

// Booking Detail Modal Component
const BookingDetailModal = ({ booking, onClose }) => {
  const { cancelBooking, confirmBooking } = useBooking();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setProcessing(true);
      try {
        await cancelBooking(booking.id);
        onClose();
      } catch (err) {
        setError('Failed to cancel booking');
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleConfirm = async () => {
    setProcessing(true);
    try {
      await confirmBooking(booking.id);
      onClose();
    } catch (err) {
      setError('Failed to confirm booking');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Booking Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded mb-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-gray-700">Booking Type</p>
              <p>{booking.get_booking_type_display}</p>
            </div>
            <div>
              <p className="font-bold text-gray-700">Status</p>
              <p className={`inline-block px-2 py-1 rounded ${
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                booking.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {booking.get_status_display}
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-700">Date & Time</p>
              <p>{booking.date} at {booking.time}</p>
            </div>
            <div>
              <p className="font-bold text-gray-700">Vehicle</p>
              <p>{booking.vehicle_details.make} {booking.vehicle_details.model} ({booking.vehicle_details.year})</p>
            </div>
          </div>
        </div>

        {booking.booking_type === 'servicing' && (
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">Service Details</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p><strong>Primary Service:</strong> {booking.primary_service?.name}</p>
              <p className="mt-2"><strong>Recommended Services:</strong></p>
              {booking.recommended_services?.length > 0 ? (
                <ul className="list-disc pl-5 mt-1">
                  {booking.recommended_services.map(service => (
                    <li key={service.id}>{service.name} - ${service.cost}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">None</p>
              )}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Base Cost:</span>
                  <span>${booking.base_cost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Additional Services:</span>
                  <span>${booking.recommended_services_cost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-${booking.discount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({booking.tax_rate}%):</span>
                  <span>${(booking.final_cost - (booking.base_cost + booking.recommended_services_cost - booking.discount)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                  <span>Total:</span>
                  <span>${booking.final_cost}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {booking.booking_type === 'purchase' && (
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">Purchase Inquiry Details</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p>{booking.purchase_details}</p>
              {booking.trade_in_vehicle && (
                <div className="mt-4">
                  <p className="font-bold">Trade-in Vehicle:</p>
                  <p>{booking.trade_in_vehicle.make} {booking.trade_in_vehicle.model} ({booking.trade_in_vehicle.year})</p>
                </div>
              )}
            </div>
          </div>
        )}

        {booking.service_notes && (
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">Service Notes</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p>{booking.service_notes}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          {booking.status === 'pending' && (
            <>
              <button
                onClick={handleCancel}
                disabled={processing}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              >
                Cancel Booking
              </button>
              <button
                onClick={handleConfirm}
                disabled={processing}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                Confirm Booking
              </button>
            </>
          )}
          {booking.status !== 'pending' && booking.status !== 'cancelled' && (
            <button
              onClick={handleCancel}
              disabled={processing || booking.status === 'completed'}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            >
              Cancel Booking
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;