import axios from 'axios';
import axiosInstance from './axiosConfig';
import { API_URL } from './config';

const BOOKING_API_URL = `${API_URL}/booking/api`;
const AUTH_API_URL = `${API_URL}/auth-app/api`;

// Centralized error handler
const handleError = (error, defaultMsg) => {
  console.error(defaultMsg, error); // Line ~9: Logs errors like "Failed to fetch dealership vehicles"

  if (error.response) {
    const { status, data } = error.response;

    if (status === 401) {
      return Promise.reject({ error: 'Authentication error. Please log in again.' });
    }
    if (status === 404) {
      return Promise.reject({ error: 'Resource not found. Please check your request.' });
    }
    if (status === 400) {
      return Promise.reject(data || { error: defaultMsg });
    }
    if (status >= 500) {
      return Promise.reject({ error: 'Server error. Please try again later.' });
    }
    return Promise.reject(data || { error: defaultMsg });
  }

  if (error.request) {
    return Promise.reject({ error: 'Network error. Please check your connection.' });
  }

  return Promise.reject({ error: defaultMsg });
};

const bookingService = {
  // 📌 Fetch all user bookings
  getUserBookings: async () => {
    try {
      const response = await axiosInstance.get(`${BOOKING_API_URL}/user/bookings/`);
      return response.data;
    } catch (error) {
      return handleError(error, 'Failed to fetch user bookings');
    }
  },

  // 📌 Create a vehicle booking
  createVehicleBooking: async ({ vehicle, date, time, notes }) => {
    try {
      const response = await axiosInstance.post(`${BOOKING_API_URL}/book-vehicle/`, {
        vehicle,
        date,
        time,
        notes,
      });
      return response.data;
    } catch (error) {
      return handleError(error, 'Failed to create vehicle booking');
    }
  },

  // 📌 Create a service booking
  createServiceBooking: async ({ service, date, time, notes }) => {
    try {
      const response = await axiosInstance.post(`${BOOKING_API_URL}/book-service/`, {
        service,
        date,
        time,
        notes,
      });
      return response.data;
    } catch (error) {
      return handleError(error, 'Failed to create service booking');
    }
  },

  // 📌 Update vehicle booking status
  updateVehicleBookingStatus: async (bookingId, status) => {
    try {
      if (!['confirmed', 'cancelled'].includes(status)) {
        return Promise.reject({ error: 'Invalid status. Must be "confirmed" or "cancelled".' });
      }
      const response = await axiosInstance.patch(
        `${BOOKING_API_URL}/vehicle-booking/${bookingId}/update-status/`,
        { status }
      );
      return response.data;
    } catch (error) {
      return handleError(error, `Failed to update vehicle booking status to ${status}`);
    }
  },

  // 📌 Update service booking status
  updateServiceBookingStatus: async (bookingId, status) => {
    try {
      if (!['confirmed', 'cancelled'].includes(status)) {
        return Promise.reject({ error: 'Invalid status. Must be "confirmed" or "cancelled".' });
      }
      const response = await axiosInstance.patch(
        `${BOOKING_API_URL}/service-booking/${bookingId}/update-status/`,
        { status }
      );
      return response.data;
    } catch (error) {
      return handleError(error, `Failed to update service booking status to ${status}`);
    }
  },

  // 📌 Confirm a booking
  confirmBooking: async (bookingId, bookingType = 'service') => {
    return bookingType === 'service'
      ? bookingService.updateServiceBookingStatus(bookingId, 'confirmed')
      : bookingService.updateVehicleBookingStatus(bookingId, 'confirmed');
  },

  // 📌 Cancel a booking
  cancelBooking: async (bookingId, bookingType = 'service') => {
    return bookingType === 'service'
      ? bookingService.updateServiceBookingStatus(bookingId, 'cancelled')
      : bookingService.updateVehicleBookingStatus(bookingId, 'cancelled');
  },

  // 🚗 Fetch service center vehicles
  getDealershipVehicles: async () => {
    try {
      console.log('Fetching vehicles from:', `${AUTH_API_URL}/vehicles/all/`); // Debugging: Confirm endpoint
      const response = await axiosInstance.get(`${AUTH_API_URL}/vehicles/all/`); // Line ~127: GET /vehicles/all/
      // Assuming is_customer_owned exists; filter client-side
      return response.data.filter((vehicle) => !vehicle.is_customer_owned);
    } catch (error) {
      return handleError(error, 'Failed to fetch dealership vehicles');
    }
  },

  // 🛠️ Fetch available services
  getServices: async () => {
    try {
      console.log('Fetching services from:', `${AUTH_API_URL}/services/all/`); // Debugging: Confirm endpoint
      const response = await axiosInstance.get(`${AUTH_API_URL}/services/all/`); // Line ~139: GET /services/all/
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return handleError(error, 'Failed to fetch services');
    }
  },

  // ⭐ Fetch all favorites
  fetchFavorites: async () => {
    try {
      console.log('Fetching favorites from:', `${BOOKING_API_URL}/favorites/`); // Debugging
      const response = await axios.get(`${BOOKING_API_URL}/favorites/`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return handleError(error, 'Failed to fetch favorites');
    }
  },

  // ⭐ Add a favorite
  addFavorite: async (type, itemId) => {
    try {
      const data = { type: type.toLowerCase() };
      data[type === 'service' ? 'service' : 'vehicle'] = itemId;
      const response = await axiosInstance.post(`${BOOKING_API_URL}/favorites/`, data);
      return response.data;
    } catch (error) {
      return handleError(error, `Failed to add ${type} to favorites`);
    }
  },

  // ⭐ Remove a favorite
  removeFavorite: async (favoriteId) => {
    try {
      const response = await axiosInstance.delete(`${BOOKING_API_URL}/favorites/${favoriteId}/`);
      return response.data;
    } catch (error) {
      return handleError(error, 'Failed to remove favorite');
    }
  },

  // ⭐ Check if an item is favorited
  checkIsFavorite: async (type, itemId) => {
    try {
      const response = await axiosInstance.get(
        `${BOOKING_API_URL}/favorites/check/?type=${type.toLowerCase()}&item_id=${itemId}`
      );
      return response.data.is_favorite;
    } catch (error) {
      return handleError(error, 'Failed to check favorite status');
    }
  },

  // ⭐ Toggle favorite status
  toggleFavorite: async (type, itemId) => {
    try {
      // Ensure proper payload format with correct field names
      const payload = {
        type: type.toLowerCase(),
        item_id: itemId
      };
      
      // Add specific fields based on type
      if (type.toLowerCase() === 'service') {
        payload.service = itemId;
      } else if (type.toLowerCase() === 'vehicle') {
        payload.vehicle = itemId;
      }
      
      const response = await axiosInstance.post(`${BOOKING_API_URL}/favorites/toggle/`, payload);
      return response.data;
    } catch (error) {
      return handleError(error, 'Failed to toggle favorite');
    }
  },
};

export default bookingService;