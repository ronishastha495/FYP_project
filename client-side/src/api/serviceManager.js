import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/';

// Account endpoints
export const PROFILE_URL = `${BASE_URL}auth-app/api/user/profile/`;
export const SERVICE_MANAGERS_URL = `${BASE_URL}auth-app/api/service-managers/`;

// ServiceCenter endpoints
export const SERVICE_CENTERS_URL = `${BASE_URL}auth-app/api/service-centers/`;  

// Vehicle endpoints
export const VEHICLES_URL = `${BASE_URL}auth-app/api/vehicle/`;

// Servicing endpoints
export const SERVICING_URL = `${BASE_URL}auth-app/api/services/`;

// Bookings
export const BOOKINGS_URL = `${BASE_URL}booking/api/user/bookings/`;

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    window.location.href = '/login';
    throw new Error('No access token found');
  }
  return { Authorization: `Bearer ${token}` };
};

const handleApiError = async (error, customMessage, retryCount = 0) => {
  if (error.message === 'Network Error' && retryCount < MAX_RETRIES) {
    await sleep(RETRY_DELAY * (retryCount + 1));
    return { shouldRetry: true, retryCount: retryCount + 1 };
  }
  const status = error.response?.status;
  if (status === 404) {
    throw new Error('The requested resource was not found');
  }
  if (status === 401) {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }
  if (status === 403) {
    throw new Error('You do not have permission to perform this action');
  }
  if (status >= 500) {
    throw new Error('Server error. Please try again later.');
  }
  if (status === 400) {
    const errs = error.response?.data;
    if (errs && typeof errs === 'object') {
      // Combine all error messages with field names
      const errorMessages = Object.entries(errs)
        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
        .join('; ');
      throw new Error(errorMessages || customMessage);
    }
    throw new Error(customMessage);
  }
  throw new Error(
    error.response?.data?.detail ||
    error.response?.data?.error ||
    error.message ||
    customMessage
  );
};

// Add a new Service Center
export const addServiceCenter = async (formData) => {
  try {
    const res = await axios.post(
      SERVICE_CENTERS_URL,
      formData,
      { headers: { 
          ...getAuthHeaders(), 
          'Content-Type': 'multipart/form-data' 
        } 
      }
    );
    return res.data;
  } catch (err) {
    throw await handleApiError(err, 'Failed to add service center');
  }
};

// Update a Service Center
export const updateServiceCenter = async (center_id, formData) => {
  try {
    const res = await axios.put(
      `${SERVICE_CENTERS_URL}${center_id}/`,
      formData,
      { headers: { 
          ...getAuthHeaders(), 
          'Content-Type': 'multipart/form-data' 
        } 
      }
    );
    return res.data;
  } catch (err) {
    throw await handleApiError(err, 'Failed to update service center');
  }
};

// Delete a Service Center
export const deleteServiceCenter = async (center_id) => {
  try {
    await axios.delete(
      `${SERVICE_CENTERS_URL}${center_id}/`,
      { headers: getAuthHeaders() }
    );
  } catch (err) {
    throw await handleApiError(err, 'Failed to delete service center');
  }
};

// Add a new Vehicle
export const addVehicle = async (formData) => {
  try {
    const res = await axios.post(
      `${VEHICLES_URL}create/`,
      formData,
      { headers: { 
          ...getAuthHeaders(), 
          'Content-Type': 'multipart/form-data' 
        } 
      }
    );
    return res.data;
  } catch (err) {
    throw await handleApiError(err, 'Failed to add vehicle');
  }
};

// Update a Vehicle
export const updateVehicle = async (vehicle_id, formData) => {
  try {
    const res = await axios.put(
      `${VEHICLES_URL}${vehicle_id}/`,
      formData,
      { headers: { 
          ...getAuthHeaders(), 
          'Content-Type': 'multipart/form-data' 
        } 
      }
    );
    return res.data;
  } catch (err) {
    throw await handleApiError(err, 'Failed to update vehicle');
  }
};

// Delete a Vehicle
export const deleteVehicle = async (vehicle_id) => {
  try {
    await axios.delete(
      `${VEHICLES_URL}${vehicle_id}/`,
      { headers: getAuthHeaders() }
    );
  } catch (err) {
    throw await handleApiError(err, 'Failed to delete vehicle');
  }
};

// Add a new Service
export const addService = async (formData) => {
  try {
    const res = await axios.post(
      `${SERVICING_URL}create/`,
      formData,
      { headers: { 
          ...getAuthHeaders(), 
          'Content-Type': 'multipart/form-data' 
        } 
      }
    );
    return res.data;
  } catch (err) {
    throw await handleApiError(err, 'Failed to add service');
  }
};

// Update a Service
export const updateService = async (service_id, formData) => {
  try {
    const res = await axios.put(
      `${SERVICING_URL}${service_id}/`,
      formData,
      { headers: { 
          ...getAuthHeaders(), 
          'Content-Type': 'multipart/form-data' 
        } 
      }
    );
    return res.data;
  } catch (err) {
    throw await handleApiError(err, 'Failed to update service');
  }
};

// Delete a Service
export const deleteService = async (service_id) => {
  try {
    await axios.delete(
      `${SERVICING_URL}${service_id}/`,
      { headers: getAuthHeaders() }
    );
  } catch (err) {
    throw await handleApiError(err, 'Failed to delete service');
  }
};