import React, { createContext, useContext, useState, useEffect } from "react";
import {
  // getServiceManagerProfile,
  // updateServiceManagerProfile,
  // getUsers,
  // getVehicles,
  addVehicle,
  // updateVehicle,
  // getServices,
  addService,
  // updateServiceStatus,
  // getServiceHistory,
  // getBookings,
  // updateBookingStatus,
  // getReminders,
  // createReminder,
  // getNotifications,
  // markNotificationAsRead,
} from "../api/serviceManager";
import { getServices, getVehicles } from "../api/services";

const ManagerContext = createContext();

export const ManagerProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchManagerData = async () => {
    try {
      // const profileData = await getServiceManagerProfile();
      // setProfile(profileData);

      // const usersData = await getUsers();
      // setUsers(usersData);

      const vehiclesData = await getVehicles();
      setVehicles(vehiclesData);

      const servicesData = await getServices();
      setServices(servicesData);

      // const serviceHistoryData = await getServiceHistory();
      // setServiceHistory(serviceHistoryData);

      // const bookingsData = await getBookings();
      // if (bookingsData) {
      //   setBookings(bookingsData);
      //   setAppointmentsCount(bookingsData.length);
      // }

      // const remindersData = await getReminders();
      // setReminders(remindersData);

      // const notificationsData = await getNotifications();
      // setNotifications(notificationsData);
    } catch (err) {
      setError("Failed to load manager data");
      console.error("Error fetching manager data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagerData();
  }, []);

  const handleError = (error, message) => {
    let errorMessage = message;
    if (error.message.includes('Network Error')) {
        errorMessage = 'Network connection issue. Please check your internet connection.';
    } else if (error.message.includes('Session expired')) {
        errorMessage = 'Your session has expired. Please login again.';
    } else if (error.response?.status === 404) {
        errorMessage = 'The requested resource was not found.';
    } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
    }
    console.error(message, error);
    setError(errorMessage);
};

  const updateProfile = async (profileData) => {
    try {
      const updatedData = await updateServiceManagerProfile(profileData);
      setProfile(updatedData);
      return updatedData;
    } catch (err) {
      handleError(err, "Failed to update profile");
      return null;
    }
  };

  const addNewVehicle = async (vehicleData) => {
    try {
      const newVehicle = await addVehicle(vehicleData);
      if (!newVehicle) {
        throw new Error('Vehicle creation failed - no data returned');
      }
      setVehicles([...vehicles, newVehicle]);
      return newVehicle;
    } catch (err) {
      handleError(err, err.message || "Failed to add new vehicle");
      throw err; // Re-throw to allow component to handle
    }
  };

  const updateExistingVehicle = async (vehicleId, vehicleData) => {
    try {
      const updatedVehicle = await updateVehicle(vehicleId, vehicleData);
      setVehicles(vehicles.map(v => (v.id === vehicleId ? updatedVehicle : v)));
      return updatedVehicle;
    } catch (err) {
      handleError(err, "Failed to update vehicle");
      return null;
    }
  };

  const addNewService = async (serviceData) => {
    try {
      const newService = await addService(serviceData);
      if (newService) {
        setServices([...services, newService]);
        return newService;
      }
      throw new Error('Service creation failed');
    } catch (err) {
      handleError(err, err.message || "Failed to add new service");
      throw err; // Re-throw to allow component to handle
    }
  };

  const updateExistingServiceStatus = async (serviceId, status) => {
    try {
      const updatedService = await updateServiceStatus(serviceId, status);
      setServices(services.map(s => (s.id === serviceId ? updatedService : s)));
      return updatedService;
    } catch (err) {
      handleError(err, "Failed to update service status");
      return null;
    }
  };

  const updateExistingBookingStatus = async (bookingId, status) => {
    try {
      const updatedBooking = await updateBookingStatus(bookingId, status);
      setBookings(bookings.map(b => (b.id === bookingId ? updatedBooking : b)));
      return updatedBooking;
    } catch (err) {
      handleError(err, "Failed to update booking status");
      return null;
    }
  };

  const value = {
    profile,
    users,
    vehicles,
    services,
    serviceHistory,
    bookings,
    appointmentsCount,
    loading,
    error,
    fetchManagerData,
    updateProfile,
    addNewVehicle,
    updateExistingVehicle,
    addNewService,
    updateExistingServiceStatus,
    updateExistingBookingStatus,
  };

  return (
    <ManagerContext.Provider value={value}>
      {children}
    </ManagerContext.Provider>
  );
};

export const useManager = () => useContext(ManagerContext);
export default ManagerContext;