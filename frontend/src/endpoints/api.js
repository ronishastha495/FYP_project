import axios from 'axios';

// Base URL and API endpoints
const BASE_URL = 'http://127.0.0.1:8000/users/';
const LOGIN_URL = `${BASE_URL}token/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`;
const APPOINTMENTS_URL = `${BASE_URL}appointments/`;
const LOGOUT_URL = `${BASE_URL}logout/`;
const AUTH_URL = `${BASE_URL}authenticated/`;
const REGISTER_URL = `${BASE_URL}register/`;


/**
 * Handles user login and returns success status.
 */
export const login = async (username, password) => {
    const response = await axios.post(
        `${BASE_URL}token/`,
        { username, password },
        { withCredentials: true }
    );
    return response.data.success;
};

export const forgotPassword = async (email) => {
    return await axios.post(`${BASE_URL}reset-password/`, { email });
  };
  
  export const resetPassword = async (token, newPassword) => {
    return await axios.post(`${BASE_URL}reset-password/${token}/`, { new_password: newPassword });
  };
  
  export const changePassword = async (oldPassword, newPassword) => {
    return await axios.post(`${BASE_URL}change-password/`, { 
      old_password: oldPassword, 
      new_password: newPassword 
    }, {
      withCredentials: true
    });
  };

/**
 * Refreshes the authentication token if expired.
 */
// api.js
export const refresh_token = async () => {
    try {
      const refreshToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('refresh_token='))
        ?.split('=')[1];
  
      await axios.post('http://127.0.0.1:8000/users/token/refresh/', { refresh: refreshToken }, {
        withCredentials: true,
      });
      return true;
    } catch (error) {
      return false;
    }
  };
  

/**
 * Fetches a list of user appointments.
 * If unauthorized (401), tries to refresh the token and retry.
//  */
export const get_appointments = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/users/appointments/', { withCredentials: true });
      return response.data;
    } catch (error) {
      return call_refresh(error, () =>
        axios.get('http://127.0.0.1:8000/users/appointments/', { withCredentials: true })
      );
    }
  };

/**
 * Handles token expiration by refreshing and retrying failed requests.
 */
const call_refresh = async (error, func) => {
    if (error.response && error.response.status === 401) {
      const tokenRefreshed = await refresh_token();
      if (tokenRefreshed) {
        const retryResponse = await func();
        return retryResponse.data;
      }
    }
    return false;
  };
  

// api.js
export const is_authenticated = async () => {
    const token = localStorage.getItem("token");
    console.log("Token being sent:", token);  // ✅ Debugging log

    if (!token) {
        return false; // No token means user is not logged in
    }

    try {
        const response = await axios.get(`${API_URL}users/authenticated/`, {
            headers: {
                Authorization: `Bearer ${token}`,  // ✅ Token must be included
            },
        });
        console.log("Authentication success:", response.data);
        return response.data;
    } catch (error) {
        console.error("Authentication check failed:", error.response);
        return false;
    }
};

  
  
export const register = async (username, email, password) => {
    const response = await axios.post(
        REGISTER_URL,
        { username, email, password },
        { withCredentials: true }
    );
    return response.data;
};

// api.js
export const logout = async () => {
    try {
      const refreshToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('refresh_token='))
        ?.split('=')[1];
  
      await axios.post(LOGOUT_URL, { refresh_token: refreshToken }, { withCredentials: true });
      return true;
    } catch (error) {
      return false;
    }
  };
  