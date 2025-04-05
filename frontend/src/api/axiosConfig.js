// axiosConfig.js - Global Axios Configuration
import axios from 'axios';
import { refresh_token } from './auth';

// Create a base axios instance with common configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add authentication token to all requests
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const refreshed = await refresh_token();
        
        if (refreshed) {
          // Update authorization header with new token
          const token = localStorage.getItem('accessToken');
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } else {
          // Do not redirect here - let components handle it
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('role');
          
          // Throw error with meaningful message
          return Promise.reject(new Error('Session expired'));
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        
        // Throw error with meaningful message
        return Promise.reject(new Error('Authentication failed'));
      }
    }
    
    // For all other errors, just pass them through
    return Promise.reject(error);
  }
);

export default axiosInstance;