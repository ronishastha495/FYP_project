import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  addVehicle,
  addService,
  addServiceCenter,
  updateVehicle,
  updateService,
  updateServiceCenter,
  deleteVehicle,
  deleteService,
  deleteServiceCenter,
  BOOKINGS_URL,
} from '../api/serviceManager';
import { getServices, getVehicles } from '../api/services';
import axios from 'axios';
import { toast } from 'react-toastify';

const ManagerContext = createContext();

export const ManagerProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const fetchManagerData = async () => {
    try {
      const [vehData, svcData, scData, bookingsData] = await Promise.all([
        getVehicles(),
        getServices(),
        axios.get('http://127.0.0.1:8000/auth-app/api/service-centers/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }).then(r => r.data),
        axios.get(BOOKINGS_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }).then(r => r.data),
      ]);
      setVehicles(vehData);
      setServices(svcData);
      setServiceCenters(scData);
      setBookings(bookingsData);
    } catch (err) {
      console.error('Error fetching manager data:', err);
      setError('Failed to load manager data');
      toast.error('Failed to load manager data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagerData();
  }, []);

  const handleError = (err, message) => {
    let msg = message;
    if (err.message.includes('Network Error')) {
      msg = 'Check your internet connection.';
    } else if (err.message.includes('Session expired')) {
      msg = 'Session expired. Please log in again.';
    } else if (err.response?.status === 404) {
      msg = 'Resource not found.';
    } else if (err.response?.status === 403) {
      msg = 'You do not have permission to perform this action.';
    } else if (err.response?.status >= 500) {
      msg = 'Server error. Try again later.';
    }
    console.error(message, err);
    setError(msg);
    toast.error(msg); // Display error to user
  };

  const addNewVehicle = async (formData) => {
    try {
      const newVeh = await addVehicle(formData);
      setVehicles(v => [...v, newVeh]);
      toast.success('Vehicle added successfully!');
      return newVeh;
    } catch (err) {
      handleError(err, err.message || 'Failed to add vehicle');
      throw err;
    }
  };

  const updateExistingVehicle = async (id, formData) => {
    try {
      const updatedVeh = await updateVehicle(id, formData);
      setVehicles(v => v.map(vehicle => (vehicle.vehicle_id === id ? updatedVeh : vehicle)));
      toast.success('Vehicle updated successfully!');
      return updatedVeh;
    } catch (err) {
      handleError(err, err.message || 'Failed to update vehicle');
      throw err;
    }
  };

  const deleteExistingVehicle = async (id) => {
    try {
      await deleteVehicle(id);
      setVehicles(v => v.filter(vehicle => vehicle.vehicle_id !== id));
      toast.success('Vehicle deleted successfully!');
    } catch (err) {
      handleError(err, err.message || 'Failed to delete vehicle');
      throw err;
    }
  };

  const addNewService = async (formData) => {
    try {
      const newSvc = await addService(formData);
      setServices(s => [...s, newSvc]);
      toast.success('Service added successfully!');
      return newSvc;
    } catch (err) {
      handleError(err, err.message || 'Failed to add service');
      throw err;
    }
  };

  const updateExistingService = async (id, formData) => {
    try {
      const updatedSvc = await updateService(id, formData);
      setServices(s => s.map(service => (service.service_id === id ? updatedSvc : service)));
      toast.success('Service updated successfully!');
      return updatedSvc;
    } catch (err) {
      handleError(err, err.message || 'Failed to update service');
      throw err;
    }
  };

  const deleteExistingService = async (id) => {
    try {
      await deleteService(id);
      setServices(s => s.filter(service => service.service_id !== id));
      toast.success('Service deleted successfully!');
    } catch (err) {
      handleError(err, err.message || 'Failed to delete service');
      throw err;
    }
  };

  const addNewServiceCenter = async (formData) => {
    try {
      const newSC = await addServiceCenter(formData);
      setServiceCenters(sc => [...sc, newSC]);
      toast.success('Service center added successfully!');
      return newSC;
    } catch (err) {
      handleError(err, err.message || 'Failed to add service center');
      throw err;
    }
  };

  const updateExistingServiceCenter = async (id, formData) => {
    try {
      const updatedSC = await updateServiceCenter(id, formData);
      setServiceCenters(sc => sc.map(center => (center.center_id === id ? updatedSC : center)));
      toast.success('Service center updated successfully!');
      return updatedSC;
    } catch (err) {
      handleError(err, err.message || 'Failed to update service center');
      throw err;
    }
  };

  const deleteExistingServiceCenter = async (id) => {
    try {
      await deleteServiceCenter(id);
      setServiceCenters(sc => sc.filter(center => center.center_id !== id));
      toast.success('Service center deleted successfully!');
    } catch (err) {
      handleError(err, err.message || 'Failed to delete service center');
      throw err;
    }
  };

  const value = {
    vehicles,
    services,
    serviceCenters,
    bookings,
    loading,
    error,
    fetchManagerData,
    addNewVehicle,
    updateExistingVehicle,
    deleteExistingVehicle,
    addNewService,
    updateExistingService,
    deleteExistingService,
    addNewServiceCenter,
    updateExistingServiceCenter,
    deleteExistingServiceCenter,
  };

  return (
    <ManagerContext.Provider value={value}>
      {children}
    </ManagerContext.Provider>
  );
};

export const useManager = () => useContext(ManagerContext);
export default ManagerContext;