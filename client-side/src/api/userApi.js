import axios from 'axios';
import { API_URL } from './config';

const PROFILE_URL = `${API_URL}/auth-app/api/user/profile/`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const fetchUserProfile = async () => {
  try {
    const response = await axios.get(PROFILE_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.detail || 'Failed to fetch user profile');
    }
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(PROFILE_URL, profileData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.detail || 'Failed to update profile');
    }
    throw error;
  }
};
