import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../contexts/BookingContext";
import BookingForm from "../components/booking/bookingForm";
import BookingList from "../components/booking/BookingList";
import BookingConfirmation from "../components/booking/BookingConfirmation";
import { toast } from "react-toastify";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const BookingPage = () => {
  const {
    bookings,
    fetchUserBookings,
    loading,
    error,
    selectedService,
    selectedVehicle,
    resetBookingSelection,
    createVehicleBooking,
    createServiceBooking,
    confirmBooking,
    cancelBooking,
  } = useBooking();

  console.log(
    "BookingPage - Component render - selectedService:",
    selectedService
  );
  console.log(
    "BookingPage - Component render - selectedVehicle:",
    selectedVehicle
  );

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    notes: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserBookings().catch((err) => {
      toast.error("Failed to fetch bookings");
    });

    if ((selectedService || selectedVehicle) && !showBookingForm) {
      setShowBookingForm(true);
    }
  }, [
    fetchUserBookings,
    selectedService,
    selectedVehicle,
    resetBookingSelection,
    showBookingForm,
  ]);

  useEffect(() => {
    // Only show the error and redirect if the user is trying to access the booking page directly
    // without selecting a service or vehicle first
    if (
      !selectedService &&
      !selectedVehicle &&
      !showBookingForm &&
      !bookings.length
    ) {
      toast.error("Please select a service or vehicle first");
      navigate("/services");
    }
  }, [
    selectedService,
    selectedVehicle,
    showBookingForm,
    navigate,
    bookings.length,
  ]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (selectedService) {
        response = await createServiceBooking({
          service: selectedService.service_id || selectedService.id,
          date: formData.date,
          time: formData.time,
          notes: formData.notes,
        });
      } else if (selectedVehicle) {
        response = await createVehicleBooking({
          vehicle: selectedVehicle.vehicle_id || selectedVehicle.id,
          date: formData.date,
          time: formData.time,
          notes: formData.notes,
          make: selectedVehicle.make,
         
        });
      }
      setConfirmedBooking(response);
      setShowBookingForm(false);
      resetBookingSelection();
      setFormData({ date: "", time: "", notes: "" });
      toast.success("Booking created successfully!");
    } catch (error) {
      toast.error(error.error || "Failed to create booking");
    }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading && !bookings.length) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600 animate-pulse">
          Loading bookings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-20 bg-white bg-opacity-90 rounded-lg my-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Vehicle Services</h1>
          <button
            onClick={() => setShowBookingForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
          >
            Book New Service
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

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
                  <p className="text-gray-500">
                    You don't have any bookings yet.
                  </p>
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
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
                >
                  Schedule Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {showBookingForm && (
          <BookingForm
            service={selectedService}
            vehicle={selectedVehicle}
            onClose={() => {
              setShowBookingForm(false);
              resetBookingSelection();
            }}
            onSubmit={handleBookingSubmit}
            onInputChange={handleInputChange}
            formData={formData}
          />
        )}

        {selectedBooking && (
          <BookingDetailModal
            booking={selectedBooking}
            onClose={handleCloseBookingDetails}
            confirmBooking={confirmBooking}
            cancelBooking={cancelBooking}
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

const BookingDetailModal = ({
  booking,
  onClose,
  confirmBooking,
  cancelBooking,
}) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const bookingType =
    booking.type === "Vehicle Purchase" ? "vehicle" : "service";

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      setProcessing(true);
      try {
        await cancelBooking(booking.booking_id, bookingType);
        toast.success("Booking cancelled successfully");
        onClose();
      } catch (err) {
        setError(err.error || "Failed to cancel booking");
        toast.error(err.error || "Failed to cancel booking");
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleConfirm = async () => {
    setProcessing(true);
    try {
      await confirmBooking(booking.booking_id, bookingType);
      toast.success("Booking confirmed successfully");
      onClose();
    } catch (err) {
      setError(err.error || "Failed to confirm booking");
      toast.error(err.error || "Failed to confirm booking");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Booking Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
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
              <p>
                {booking.type === "Vehicle Service Booking"
                  ? "Servicing"
                  : "Purchase"}
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-700">Status</p>
              <p
                className={`inline-block px-2 py-1 rounded text-sm ${
                  booking.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : booking.status === "confirmed"
                    ? "bg-blue-100 text-blue-800"
                    : booking.status === "in_progress"
                    ? "bg-purple-100 text-purple-800"
                    : booking.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-700">Date & Time</p>
              <p>
                {booking.date} at {booking.time}
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-700">Total Price</p>
              <p>${booking.total_price || "N/A"}</p>
            </div>
          </div>
          {booking.type === "Vehicle Service Booking" && (
            <div className="mt-4">
              <p className="font-bold text-gray-700">Service</p>
              <p>{booking.service?.name || "N/A"}</p>
            </div>
          )}
          {booking.type === "Vehicle Purchase" && (
            <div className="mt-4">
              <p className="font-bold text-gray-700">Vehicle</p>
              <p>
                {booking.vehicle?.make || "N/A"} {booking.vehicle?.model || ""}{" "}
                {booking.vehicle?.year ? `(${booking.vehicle.year})` : ""}
              </p>
            </div>
          )}
          {booking.notes && (
            <div className="mt-4">
              <p className="font-bold text-gray-700">Notes</p>
              <p>{booking.notes}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          {booking.status === "pending" && (
            <>
              <button
                onClick={handleCancel}
                disabled={processing}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 transition duration-200"
              >
                Cancel Booking
              </button>
              <button
                onClick={handleConfirm}
                disabled={processing}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 transition duration-200"
              >
                Confirm Booking
              </button>
            </>
          )}
          {booking.status !== "pending" && booking.status !== "cancelled" && (
            <button
              onClick={handleCancel}
              disabled={processing || booking.status === "completed"}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 transition duration-200"
            >
              Cancel Booking
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
