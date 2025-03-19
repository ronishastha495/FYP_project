import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/';
// const LOGIN_URL = `${BASE_URL}token/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`;
const APPOINTMENTS_URL = `${BASE_URL}appointments/`;
const LOGOUT_URL = `${BASE_URL}logout/`;
const AUTH_URL = `${BASE_URL}authenticated/`;
const REGISTER_URL = `${BASE_URL}register/`;
// const LOGIN_URL = `${BASE_URL}login/`;
const SERVICES_URL = `${BASE_URL}services/`;


// 📌 Helper function to get the refresh token from cookies
const getRefreshToken = () => {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('refresh_token='))
        ?.split('=')[1];
};

const checkAuthentication = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/authenticated/', {
            withCredentials: true,  // Include cookies for session-based authentication
        });
        return response.data;
    } catch (error) {
        console.error('Authentication check failed:', error);
        throw error;
    }
};

// Usage
checkAuthentication()
    .then(data => {
        if (data.authenticated) {
            console.log('User is authenticated:', data.username);
        } else {
            console.log('User is not authenticated');
        }
    })
    .catch(error => {
        console.error('Error checking authentication:', error);
    });

/**
 * 🏷️ Login user and store token
 */
export const login = async (username, password) => {
    try {
        const response = await axios.post(LOGIN_URL, { username, password }, { withCredentials: true });
        localStorage.setItem("token", response.data.access);
        document.cookie = `refresh_token=${response.data.refresh}; path=/;`;
        return true;
    } catch (error) {
        console.error("Login failed:", error.response?.data);
        return false;
    }
};

/**
 * 🔄 Refresh token if expired
 */
export const refresh_token = async () => {
    try {
        const refreshToken = getRefreshToken();
        const response = await axios.post(REFRESH_URL, { refresh: refreshToken }, { withCredentials: true });
        localStorage.setItem("token", response.data.access);
        return true;
    } catch (error) {
        console.error("Token refresh failed:", error.response?.data);
        return false;
    }
};

/**
 * 📌 Register a user with role selection
 */
export const register = async (username, email, password, role) => {
    try {
        const response = await axios.post(REGISTER_URL, { username, email, password, role }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Registration error:", error.response?.data);
        throw error;
    }
};

/**
 * 👀 Check if the user is authenticated
 */
// export const is_authenticated = async () => {
//     try {
//         const token = localStorage.getItem("token");
//         if (!token) return false;
        
//         const response = await axios.get(AUTH_URL, {
//             headers: { Authorization: `Bearer ${token}` },
//         });

//         return response.data;
//     } catch (error) {
//         console.error("Authentication check failed:", error.response?.data);
//         return false;
//     }
// };

/**
 * 📌 Fetch user appointments with token refresh handling
 */
export const get_appointments = async () => {
    try {
        const response = await axios.get(APPOINTMENTS_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return call_refresh(error, () =>
            axios.get(APPOINTMENTS_URL, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
            })
        );
    }
};

/**
 * 🚪 Logout user and clear tokens
 */
export const logout = async () => {
    try {
        await axios.post(LOGOUT_URL, { refresh_token: getRefreshToken() }, { withCredentials: true });
        localStorage.removeItem("token");
        document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        return true;
    } catch (error) {
        console.error("Logout failed:", error.response?.data);
        return false;
    }
};

/**
 * 🔄 Handles token expiration and retries requests
 */
const call_refresh = async (error, func) => {
    if (error.response?.status === 401) {
        const refreshed = await refresh_token();
        if (refreshed) return await func();
    }
    return false;
};

/**
 * 🏷️ Fetch user vehicles
 */
export const getVehicles = async () => {
    try {
        const response = await axios.get(`${SERVICES_URL}vehicles/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return call_refresh(error, () =>
            axios.get(`${SERVICES_URL}vehicles/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
            })
        );
    }
};

/**
 * 🏷️ Fetch service history for a vehicle
 */
export const getServiceHistory = async (vehicleId) => {
    try {
        const response = await axios.get(`${SERVICES_URL}service-history/?vehicle=${vehicleId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return call_refresh(error, () =>
            axios.get(`${SERVICES_URL}service-history/?vehicle=${vehicleId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
            })
        );
    }
};

/**
 * 🏷️ Fetch user bookings
 */
export const getBookings = async () => {
    try {
        const response = await axios.get(`${SERVICES_URL}bookings/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return call_refresh(error, () =>
            axios.get(`${SERVICES_URL}bookings/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
            })
        );
    }
};

/**
 * 🏷️ Fetch user reminders
 */
export const getReminders = async () => {
    try {
        const response = await axios.get(`${SERVICES_URL}reminders/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return call_refresh(error, () =>
            axios.get(`${SERVICES_URL}reminders/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
            })
        );
    }
};