import axiosInstance from './axiosConfig';

const BASE_URL = 'http://localhost:8000/';
const SERVICES_URL = `${BASE_URL}services/servicing/`;
const VEHICLES_URL = `${BASE_URL}services/vehicles/`;
const BOOKINGS_URL = `${BASE_URL}services/bookings/`;

// Use the configured axios instance from axiosConfig
const api = axiosInstance;

const handleApiError = (error) => {
  throw error; // Just rethrow since interceptor already handled it
};

export const getServices = async () => {
    try {
        const response = await api.get(SERVICES_URL);
        // Ensure we always return an array
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        handleApiError(error);
        return []; // Return empty array on error
    }
};

export const getVehicles = async () => {
    try {
        const response = await api.get(VEHICLES_URL);
        // Ensure we always return an array
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        handleApiError(error);
        return []; // Return empty array on error
    }
};

export const createBooking = async (bookingData) => {
    try {
        const response = await api.post(BOOKINGS_URL, bookingData, {
            headers: { 
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const getServiceDetails = async (serviceId) => {
    try {
        const response = await api.get(`${SERVICES_URL}${serviceId}/`);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export const getVehicleDetails = async (vehicleId) => {
    try {
        const response = await api.get(`${VEHICLES_URL}${vehicleId}/`);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};