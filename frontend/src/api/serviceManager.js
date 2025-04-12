// serviceManager.js
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/';

// Endpoints - make sure these match your Django backend URLs exactly
const PROFILE_URL = `${BASE_URL}account/service_manager/profile/`;
const USERS_URL = `${BASE_URL}account/users/`;
const VEHICLES_URL = `${BASE_URL}services/vehicles/`;
const SERVICING_URL = `${BASE_URL}services/servicing/`;
const SERVICE_HISTORY_URL = `${BASE_URL}services/service-history/`;
const BOOKINGS_URL = `${BASE_URL}services/bookings/`;

// Error handler with enhanced 404 handling
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/login';
        throw new Error('No access token found');
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

const getBookings = async () => {
    try {
        const response = await axios.get(BOOKINGS_URL, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        const result = await handleApiError(error, 'Failed to fetch bookings');
        if (result?.shouldRetry) {
            return getBookings();
        }
        throw error;
    }
};

const handleApiError = async (error, customMessage, retryCount = 0) => {
    // Network error handling with retry
    if (error.message === 'Network Error' && retryCount < MAX_RETRIES) {
        await sleep(RETRY_DELAY * (retryCount + 1));
        return { shouldRetry: true, retryCount: retryCount + 1 };
    }

    // Handle 404 specifically
    if (error.response?.status === 404) {
        console.error('Endpoint not found:', error.config.url);
        throw new Error('The requested resource was not found');
    }

    // Token expiration handling
    if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
    }

    // Server error handling
    if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
    }

    // Validation error handling
    if (error.response?.status === 400) {
        const validationErrors = error.response.data;
        if (typeof validationErrors === 'object') {
            const errorMessages = Object.values(validationErrors).flat().join(', ');
            throw new Error(errorMessages || customMessage);
        }
    }

    // Default error handling
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.error || 
                        error.message || 
                        customMessage;
    console.error(customMessage, error);
    throw new Error(errorMessage);
};

// Add new service
export const addService = async (serviceData) => {
    try {
        const response = await axios.post(SERVICING_URL, serviceData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw await handleApiError(error, 'Failed to add service');
    }
};

// Add new vehicle
export const addVehicle = async (vehicleData) => {
    try {
        const response = await axios.post(VEHICLES_URL, vehicleData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'multipart/form-data'
            }
        });
        
        if (!response.data) {
            throw new Error('Vehicle creation failed - no data returned');
        }
        
        // Validate required fields
        if (!response.data.id || !response.data.make || !response.data.model) {
            throw new Error('Invalid vehicle data received from server');
        }
        
        return response.data;
    } catch (error) {
        throw await handleApiError(error, 'Failed to add vehicle');
    }
};
