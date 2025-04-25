import axios from 'axios';

// Configuration
const API_CONFIG = {
  baseURL: 'http://127.0.0.1:8000/auth-app/api/',
  timeout: 10000, // 10 seconds timeout
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Create axios instance with default configuration
const api = axios.create(API_CONFIG);

// Error handling middleware
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error:', error);
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }

    // Handle token refresh for 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        if (newToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear tokens if refresh fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error('Session expired. Please login again.');
      }
    }

    // Handle other errors
    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      const errorMessage = error.response.data?.detail || 
                         error.response.data?.message || 
                         'Request failed';
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please try again.');
    } else {
      // Something happened in setting up the request
      throw new Error('Request configuration error.');
    }
  }
);

// Helper function to get refresh token
const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

// Token refresh function
export const refreshToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post('http://127.0.0.1:8000/auth-app/api/token/refresh/', { refresh: refreshToken });
    const newAccessToken = response.data.access;
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

// Authentication functions
export const isAuthenticated = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return { is_authenticated: false };
    
    const response = await axios.get('http://127.0.0.1:8000/auth-app/api/check-auth/', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    return response.data;
  } catch (error) {
    console.error('Auth check failed:', error);
    return { is_authenticated: false };
  }
};

export const login = async (username, password) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/auth-app/api/login/', { username, password });
    
    if (!response.data?.access || !response.data?.refresh) {
      throw new Error('Invalid server response');
    }

    // Store tokens and user data from login response directly
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);

    return {
      access: response.data.access,
      refresh: response.data.refresh,
      user: response.data.user || { username: username },
      role: response.data.role || 'customer'
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    try {
      await api.post('logout/', null, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
  
  // Clear local storage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
};

export const register = async (userData) => {
  try {
    const response = await api.post('register/', userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};
