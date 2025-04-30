import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import bookingService from '../api/bookingService';// Adjust the import path as necessary
import { toast } from 'react-toastify';

// Create context
const BookingContext = createContext();
export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [customerVehicles, setCustomerVehicles] = useState([]);
  const [dealershipVehicles, setDealershipVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Fetch all user bookings
  const fetchUserBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getUserBookings();
      setBookings(data);
      return data;
    } catch (err) {
      const errorMsg = err.error || 'Failed to fetch bookings';
      setError(errorMsg);
      toast.error(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch vehicles and services on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [customerVehiclesData, dealershipVehiclesData, servicesData] = await Promise.all([
          bookingService.getUserBookings(),
          bookingService.getDealershipVehicles(),
          bookingService.getServices(),
        ]);
        setCustomerVehicles(customerVehiclesData);
        setDealershipVehicles(dealershipVehiclesData);
        setServices(servicesData);
      } catch (err) {
        console.error('Error loading initial data:', err);
        const errorMsg = err.error || 'Failed to load initial data';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Create a vehicle booking
  const createVehicleBooking = async ({ vehicle, date, time, notes }) => {
    setLoading(true);
    setError(null);
    try {
      const newBooking = await bookingService.createVehicleBooking({ vehicle, date, time, notes });
      setBookings((prev) => [...prev, newBooking]);
      toast.success('Vehicle booking created successfully!');
      return newBooking;
    } catch (err) {
      const errorMsg = err.error || 'Failed to create vehicle booking';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a service booking
  const createServiceBooking = async ({ service, date, time, notes }) => {
    setLoading(true);
    setError(null);
    try {
      const newBooking = await bookingService.createServiceBooking({ service, date, time, notes });
      setBookings((prev) => [...prev, newBooking]);
      toast.success('Service booking created successfully!');
      return newBooking;
    } catch (err) {
      const errorMsg = err.error || 'Failed to create service booking';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId, bookingType = 'service') => {
    setLoading(true);
    setError(null);
    try {
      const updateMethod = bookingType === 'service' 
        ? bookingService.updateServiceBookingStatus 
        : bookingService.updateVehicleBookingStatus;
      
      await updateMethod(bookingId, 'cancelled');
      setBookings((prev) =>
        prev.map((booking) =>
          booking.booking_id === bookingId ? { ...booking, status: 'cancelled' } : booking
        )
      );
      toast.success('Booking cancelled successfully');
    } catch (err) {
      const errorMsg = err.error || 'Failed to cancel booking';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Confirm a booking
  const confirmBooking = async (bookingId, bookingType = 'service') => {
    setLoading(true);
    setError(null);
    try {
      const updateMethod = bookingType === 'service' 
        ? bookingService.updateServiceBookingStatus 
        : bookingService.updateVehicleBookingStatus;
      
      await updateMethod(bookingId, 'confirmed');
      setBookings((prev) =>
        prev.map((booking) =>
          booking.booking_id === bookingId ? { ...booking, status: 'confirmed' } : booking
        )
      );
      toast.success('Booking confirmed successfully');
    } catch (err) {
      const errorMsg = err.error || 'Failed to confirm booking';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Select service for booking
  const selectServiceForBooking = (service) => {
    setSelectedService(service);
  };

  // Select vehicle for booking
  const selectVehicleForBooking = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  // Reset booking selection
  const resetBookingSelection = useCallback(() => {
    setSelectedService(null);
    setSelectedVehicle(null);
  }, []);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        customerVehicles,
        dealershipVehicles,
        services,
        loading,
        error,
        selectedService,
        selectedVehicle,
        fetchUserBookings,
        createVehicleBooking,
        createServiceBooking,
        cancelBooking,
        confirmBooking,
        selectServiceForBooking,
        selectVehicleForBooking,
        resetBookingSelection,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;