// serviceManager.js
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/';

// Endpoints
const PROFILE_URL = `${BASE_URL}account/service_manager/profile/`;
const USERS_URL = `${BASE_URL}account/users/`;
const VEHICLES_URL = `${BASE_URL}services/vehicles/`;
const SERVICING_URL = `${BASE_URL}services/servicing/`;
const SERVICE_HISTORY_URL = `${BASE_URL}services/service-histories/`;
const BOOKINGS_URL = `${BASE_URL}services/bookings/`;
const REMINDERS_URL = `${BASE_URL}services/reminders/`;
const NOTIFICATIONS_URL = `${BASE_URL}services/notifications/`;

// Error handler with retry mechanism
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handleApiError = async (error, customMessage, retryCount = 0) => {
    // Network error handling with retry
    if (error.message === 'Network Error' && retryCount < MAX_RETRIES) {
        await sleep(RETRY_DELAY * (retryCount + 1));
        return { shouldRetry: true, retryCount: retryCount + 1 };
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
    const errorMessage = error.response?.data?.error || error.message || customMessage;
    console.error(customMessage, error);
    throw new Error(errorMessage);
};

// Get service manager profile
// Get service manager profile
export const getServiceManagerProfile = async () => {
    let retryCount = 0;
    while (retryCount < MAX_RETRIES) {
        try {
            const response = await axios.get(PROFILE_URL, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            return response.data;
        } catch (error) {
            const result = await handleApiError(error, 'Error fetching service manager profile', retryCount);
            if (result?.shouldRetry) {
                retryCount = result.retryCount;
                continue;
            }
            throw error;
        }
    }
};

// Update service manager profile
export const updateServiceManagerProfile = async (profileData) => {
    try {
        const response = await axios.put(PROFILE_URL, profileData, {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error updating service manager profile');
    }
};

// Get all users
export const getUsers = async () => {
    try {
        const response = await axios.get(USERS_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error fetching users');
    }
};

// Get all vehicles
export const getVehicles = async () => {
    try {
        const response = await axios.get(VEHICLES_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error fetching vehicles');
    }
};

// Add new vehicle
export const addVehicle = async (vehicleData) => {
    try {
        const formData = new FormData();
        Object.keys(vehicleData).forEach(key => {
            if (vehicleData[key] !== null && vehicleData[key] !== undefined) {
                formData.append(key, vehicleData[key]);
            }
        });

        const response = await axios.post(VEHICLES_URL, formData, {   
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error adding vehicle');
    }
};

// Update vehicle details
export const updateVehicle = async (vehicleId, vehicleData) => {
    try {
        const response = await axios.patch(`${VEHICLES_URL}${vehicleId}/`, vehicleData, {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error updating vehicle');
    }
};

// Get all services
export const getServices = async () => {
    try {
        const response = await axios.get(SERVICING_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error fetching services');
    }
};

// Add new service
export const addService = async (serviceData) => {
    try {
        const response = await axios.post(SERVICING_URL, serviceData, {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error adding service');
    }
};

// Update service status
export const updateServiceStatus = async (serviceId, status) => {
    try {
        const response = await axios.patch(`${SERVICING_URL}${serviceId}/`, { status }, {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error updating service status');
    }
};

// Get service history
export const getServiceHistory = async () => {
    try {
        const response = await axios.get(SERVICE_HISTORY_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error fetching service history');
    }
};

// Get bookings
export const getBookings = async () => {
    try {
        const response = await axios.get(BOOKINGS_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error fetching bookings');
    }
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
    try {
        const response = await axios.patch(`${BOOKINGS_URL}${bookingId}/`, { status }, {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error updating booking status');
    }
};

// Get reminders
export const getReminders = async () => {
    try {
        const response = await axios.get(REMINDERS_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error fetching reminders');
    }
};

// Create reminder
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
        handleApiError(error, 'Error creating reminder');
    }
};

// Get notifications
export const getNotifications = async () => {
    try {
        const response = await axios.get(NOTIFICATIONS_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error fetching notifications');
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
