// context/BookingContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import bookingService from '../api/bookingService';
import { toast } from 'react-toastify';

// Create context
const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  // State
  const [bookings, setBookings] = useState([]);
  const [customerVehicles, setCustomerVehicles] = useState([]);
  const [dealershipVehicles, setDealershipVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bookingType, setBookingType] = useState(null);

  // Fetch all bookings
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getBookings();
      console.log('Bookings data fetched:', data);
      setBookings(data);
      return data;
    } catch (err) {
      const errorMsg = err.error || 'Failed to fetch bookings';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch vehicles and services on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Fetch customer vehicles
        const customerVehiclesData = await bookingService.getCustomerVehicles();
        setCustomerVehicles(customerVehiclesData);
        
        // Fetch dealership vehicles
        const dealershipVehiclesData = await bookingService.getDealershipVehicles();
        setDealershipVehicles(dealershipVehiclesData);
        
        // Fetch services
        const servicesData = await bookingService.getServices();
        console.log('Services data fetched:', servicesData);
        setServices(servicesData);
      } catch (err) {
        const errorMsg = err.error || 'Failed to load initial data';
        setError(errorMsg);
        toast.error(errorMsg);
        console.error('Error loading initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Create a new booking
  const createBooking = async (bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const newBooking = await bookingService.createBooking(bookingData);
      setBookings([...bookings, newBooking]);
      toast.success('Booking created successfully!');
      return newBooking;
    } catch (err) {
      const errorMsg = err.error || 'Failed to create booking';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a booking
  const updateBooking = async (id, bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedBooking = await bookingService.updateBooking(id, bookingData);
      setBookings(bookings.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      ));
      toast.success('Booking updated successfully!');
      return updatedBooking;
    } catch (err) {
      const errorMsg = err.error || 'Failed to update booking';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel a booking
  const cancelBooking = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await bookingService.cancelBooking(id);
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status: 'cancelled' } : booking
      ));
      toast.success('Booking cancelled successfully');
    } catch (err) {
      const errorMsg = err.error || 'Failed to cancel booking';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Confirm a booking
  const confirmBooking = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await bookingService.confirmBooking(id);
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status: 'confirmed' } : booking
      ));
      toast.success('Booking confirmed successfully');
    } catch (err) {
      const errorMsg = err.error || 'Failed to confirm booking';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Set selected service for booking
  const selectServiceForBooking = (service) => {
    setSelectedService(service);
    setBookingType('servicing');
  };

  // Set selected vehicle for booking
  const selectVehicleForBooking = (vehicle) => {
    setSelectedVehicle(vehicle);
    setBookingType('purchase');
  };

  // Reset booking selection
  const resetBookingSelection = () => {
    setSelectedService(null);
    setSelectedVehicle(null);
    setBookingType(null);
  };

  // Context value
  const value = {
    bookings,
    customerVehicles,
    dealershipVehicles,
    services,
    loading,
    error,
    selectedService,
    selectedVehicle,
    bookingType,
    fetchBookings,
    createBooking,
    updateBooking,
    cancelBooking,
    confirmBooking,
    selectServiceForBooking,
    selectVehicleForBooking,
    resetBookingSelection
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;