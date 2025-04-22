import axios from 'axios';
import { API_URL } from './config';

const VEHICLES_URL = `${API_URL}/auth-app/api/vehicles/all/`;
const SERVICES_URL = `${API_URL}/auth-app/api/services/all/`;

const getAuthHeaders = () => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
});

export const getVehicles = async () => {
  try {
    const response = await axios.get(VEHICLES_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch vehicles:', error);
    throw error;
  }
};

export const getServices = async () => {
  try {
    const response = await axios.get(SERVICES_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw error;
  }
};
