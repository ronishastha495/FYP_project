// api/bookingService.js
import axiosInstance from './axiosConfig';

const API_URL = 'services';

// Booking endpoints
const BOOKING_URL = `${API_URL}/bookings`;
   
// Error handler function
const handleError = (error, message) => {
  console.error(message, error);
  if (error.response?.status === 401) {
    window.location.href = '/login';
  }
  throw error.response?.data || { error: message };
};

// Get all bookings
export const getBookings = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/bookings`);
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to fetch bookings');
  }
};

// Get all bookings for the current user
export const getUserBookings = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/bookings`);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching user bookings");
  }
};

export const bookingService = {
  // Get all bookings
  getBookings: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/bookings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error.response?.data || { error: 'Failed to fetch bookings' };
    }
  },

  // Get specific booking
  getBookingById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/bookings/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error.response?.data || { error: 'Failed to fetch booking details' };
    }
  },

  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      // Validate required fields based on booking type
      if (bookingData.booking_type === 'servicing') {
        if (!bookingData.primary_service) {
          throw { error: 'Primary service is required for servicing bookings' };
        }
        if (bookingData.vehicle_context !== 'customer_owned') {
          throw { error: 'Service bookings must use customer-owned vehicles' };
        }
      } else if (bookingData.booking_type === 'purchase') {
        if (!bookingData.purchase_details) {
          throw { error: 'Purchase details are required for purchase inquiries' };
        }
        if (bookingData.vehicle_context !== 'dealership_vehicle') {
          throw { error: 'Purchase inquiries must reference dealership vehicles' };
        }
      }

      // Ensure all required fields are present
      if (!bookingData.vehicle || !bookingData.date || !bookingData.time) {
        throw { error: 'Vehicle, date, and time are required fields' };
      }

      const userToken = localStorage.getItem("accessToken");

      const response = await axiosInstance.post(`${API_URL}/bookings/`, bookingData, 
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`, //jwt token 
          },
    });
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      if (error.error) {
        throw error; // Our custom validation error
      }
      throw error.response?.data || { error: 'Failed to create booking' };
    }
  },

  // Update a booking
  updateBooking: async (id, bookingData) => {
    try {
      const response = await api.put(`${API_URL}/bookings/${id}/`, bookingData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error updating booking ${id}:`, error);
      throw error.response?.data || { error: 'Failed to update booking' };
    }
  },

  // Cancel a booking
  cancelBooking: async (id) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/bookings/${id}/cancel/`, {});
      return response.data;
    } catch (error) {
      console.error(`Error cancelling booking ${id}:`, error);
      throw error.response?.data || { error: 'Failed to cancel booking' };
    }
  },

  // Confirm a booking
  confirmBooking: async (id) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/bookings/${id}/confirm/`, {});
      return response.data;
    } catch (error) {
      console.error(`Error confirming booking ${id}:`, error);
      throw error.response?.data || { error: 'Failed to confirm booking' };
    }
  },

  // Get customer vehicles
  getCustomerVehicles: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/vehicles/`);
      // Filter only customer owned vehicles
      return response.data.filter(vehicle => vehicle.is_customer_owned);
    } catch (error) {
      console.error('Error fetching customer vehicles:', error);
      throw error.response?.data || { error: 'Failed to fetch vehicles' };
    }
  },

  // Get dealership vehicles (for purchase inquiries)
  getDealershipVehicles: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/vehicles/`);
      // Filter only dealership vehicles
      return response.data.filter(vehicle => !vehicle.is_customer_owned);
    } catch (error) {
      console.error('Error fetching dealership vehicles:', error);
      throw error.response?.data || { error: 'Failed to fetch dealership vehicles' };
    }
  },

  // Get services
  getServices: async () => {
    try {
      console.log('Fetching services from:', `${API_URL}/servicing/`);
      const token = localStorage.getItem('accessToken');
      const response = await axiosInstance.get(`${API_URL}/servicing/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Services data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error.response?.data || { error: 'Failed to fetch services' };
    }
  },

  // Get servicing data for a specific booking
  getServicingData: async (bookingId) => {
    try {
      const response = await api.get(`${API_URL}/bookings/${bookingId}/servicing/`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error fetching servicing data for booking ${bookingId}:`, error);
      throw error.response?.data || { error: 'Failed to fetch servicing data' };
    }
  }
};

export default bookingService;