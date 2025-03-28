import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/';
const SERVICES_URL = `${BASE_URL}services/servicing/`;
const VEHICLES_URL = `${BASE_URL}services/vehicles/`;
const BOOKINGS_URL = `${BASE_URL}services/bookings/`;

const handleApiError = (error, customMessage) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
    }

    if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
    }

    const errorMessage = error.response?.data?.error || error.message || customMessage;
    throw new Error(errorMessage);
};

export const getServices = async () => {
    try {
        const response = await axios.get(SERVICES_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to fetch services');
    }
};

export const getVehicles = async () => {
    try {
        const response = await axios.get(VEHICLES_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to fetch vehicles');
    }
};

export const createBooking = async (bookingData) => {
    try {
        const response = await axios.post(BOOKINGS_URL, bookingData, {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to create booking');
    }
};