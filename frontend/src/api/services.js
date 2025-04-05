import axios from 'axios';
import { refresh_token } from './auth';

const BASE_URL = 'http://localhost:8000/';
const SERVICES_URL = `${BASE_URL}services/servicing/`;
const VEHICLES_URL = `${BASE_URL}services/vehicles/`;
const BOOKINGS_URL = `${BASE_URL}services/bookings/`;

// Create axios instance with interceptors
const api = axios.create();

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If 401 error and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const refreshed = await refresh_token();
        if (refreshed) {
          // Update authorization header with new token
          originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
    }
    
    // For other errors
    if (error.response?.status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }
    
    const errorMessage = error.response?.data?.error || error.message || 'Request failed';
    return Promise.reject(new Error(errorMessage));
  }
);

const handleApiError = (error) => {
  throw error; // Just rethrow since interceptor already handled it
};

export const getServices = async () => {
    try {
        const response = await api.get(SERVICES_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const getVehicles = async () => {
    try {
        const response = await api.get(VEHICLES_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const createBooking = async (bookingData) => {
    try {
        const response = await api.post(BOOKINGS_URL, bookingData, {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
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
        const response = await api.get(`${SERVICES_URL}${serviceId}/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export const getVehicleDetails = async (vehicleId) => {
    try {
        const response = await api.get(`${VEHICLES_URL}${vehicleId}/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
