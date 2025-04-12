import axios from "axios";
import { refresh_token } from "./auth";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshed = await refresh_token();
        if (refreshed) {
          const newToken = localStorage.getItem("accessToken");
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(new Error("Session expired. Please login again."));
      }
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Backend server unavailable');
      return Promise.reject(new Error('Service unavailable. Please try again later.'));
    }

    // Handle other errors
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        error.message || 
                        'Request failed';
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;