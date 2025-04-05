// serviceManager.js
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/';

// Endpoints - make sure these match your Django backend URLs exactly
const PROFILE_URL = `${BASE_URL}account/service_manager/profile/`;
const USERS_URL = `${BASE_URL}account/users/`;
const VEHICLES_URL = `${BASE_URL}services/vehicles/`;
const SERVICING_URL = `${BASE_URL}services/servicing/`;
const SERVICE_HISTORY_URL = `${BASE_URL}services/service-histories/`;
const BOOKINGS_URL = `${BASE_URL}services/bookings/`;
const REMINDERS_URL = `${BASE_URL}services/reminders/`;
const NOTIFICATIONS_URL = `${BASE_URL}services/notifications/`; // Verify this endpoint exists

// Error handler with enhanced 404 handling
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getBookings = async () => {
    try {
        const response = await axios.get(BOOKINGS_URL, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
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

// Get notifications with improved error handling
export const getNotifications = async () => {
    let retryCount = 0;
    while (retryCount < MAX_RETRIES) {
        try {
            const response = await axios.get(NOTIFICATIONS_URL, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                validateStatus: function (status) {
                    return status < 500; // Reject only if status is >= 500
                }
            });
            
            // Handle 404 specifically since we're not rejecting it above
            if (response.status === 404) {
                console.warn('Notifications endpoint not found, returning empty array');
                return [];
            }
            
            return response.data;
        } catch (error) {
            const result = await handleApiError(error, 'Error fetching notifications', retryCount);
            if (result?.shouldRetry) {
                retryCount = result.retryCount;
                continue;
            }
            
            // For 404 errors, return empty array instead of throwing error
            if (error.message.includes('not found')) {
                return [];
            }
            
            throw error;
        }
    }
};

// Add new service
export const addService = async (serviceData) => {
    try {
        const response = await axios.post(SERVICING_URL, serviceData, {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to add service');
    }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await axios.patch(`${NOTIFICATIONS_URL}${notificationId}/`, { is_read: true }, {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error marking notification as read');
    }
};

// Add new vehicle
export const addVehicle = async (vehicleData) => {
    try {
        const response = await axios.post(VEHICLES_URL, vehicleData, {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to add vehicle');
    }
};

// Create new reminder
export const createReminder = async (reminderData) => {
    try {
        const response = await axios.post(REMINDERS_URL, reminderData, {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to create reminder');
    }
};
