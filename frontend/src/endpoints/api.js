import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/';
// const LOGIN_URL = `${BASE_URL}token/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`;
// const APPOINTMENTS_URL = `${BASE_URL}appointments/`;
const LOGOUT_URL = `${BASE_URL}account/logout/`;
const AUTH_URL = `${BASE_URL}account/authenticated/`;
const REGISTER_URL = `${BASE_URL}account/register/`;
const LOGIN_URL = `${BASE_URL}account/login/`;
// const SERVICES_URL = `${BASE_URL}services/`;

const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
};

export const is_authenticated = async () => {
    try {
        const response = await axios.get(AUTH_URL, { 
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } 
        });
        return response.data;
    } catch {
        return false;
    }
};

export const login = async (username, password) => {
    try {
        const response = await axios.post(LOGIN_URL, 
            { username, password }, 
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true 
            }
        );

        localStorage.setItem("accessToken", response.data.access); // ✅ Save JWT token
        localStorage.setItem("refreshToken", response.data.refresh); // ✅ Save JWT token
        return response.data;
    } catch (error) {
        console.error("Login failed:", error.response?.data);
        return false;
    }
};

export const register = async (username, email, password, role) => {
    try {
        await axios.post(REGISTER_URL, { username, email, password, role }, { withCredentials: true });
        alert("User registered successfully");
    } catch (error) {
        console.error("Registration failed:", error.response?.data);
        alert("Error registering user");
    }
};

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

export const logout = async () => {
    try {
        // Retrieve access and refresh tokens
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
            console.warn("No refresh token found.");
            return false;
        }

        // Comprehensive logout request
        const response = await axios.post('/account/logout/', 
            { refresh_token: refreshToken }, 
            { 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}` // Include access token in header
                },
                withCredentials: true // Important for cookie-based auth
            }
        );

        // Clear all authentication-related storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Clear all cookies
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        return true;
    } catch (error) {
        console.error("Logout failed:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return false;
    }
};

const call_refresh = async (error, func) => {
    if (error.response?.status === 401) {
        const refreshed = await refresh_token();
        if (refreshed) return await func();
    }
    return false;
};

// export const getVehicles = async () => {
//     try {
//         const response = await axios.get(`${SERVICES_URL}vehicles/`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//             withCredentials: true,
//         });
//         return response.data;
//     } catch (error) {
//         return call_refresh(error, () =>
//             axios.get(`${SERVICES_URL}vehicles/`, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//                 withCredentials: true,
//             })
//         );
//     }
// };

// /**
//  * 🏷️ Fetch service history for a vehicle
//  */
// export const getServiceHistory = async (vehicleId) => {
//     try {
//         const response = await axios.get(`${SERVICES_URL}service-history/?vehicle=${vehicleId}`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//             withCredentials: true,
//         });
//         return response.data;
//     } catch (error) {
//         return call_refresh(error, () =>
//             axios.get(`${SERVICES_URL}service-history/?vehicle=${vehicleId}`, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//                 withCredentials: true,
//             })
//         );
//     }
// };

// /**
//  * 🏷️ Fetch user bookings
//  */
// export const getBookings = async () => {
//     try {
//         const response = await axios.get(`${SERVICES_URL}bookings/`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//             withCredentials: true,
//         });
//         return response.data;
//     } catch (error) {
//         return call_refresh(error, () =>
//             axios.get(`${SERVICES_URL}bookings/`, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//                 withCredentials: true,
//             })
//         );
//     }
// };

// /**
//  * 🏷️ Fetch user reminders
//  */
// export const getReminders = async () => {
//     try {
//         const response = await axios.get(`${SERVICES_URL}reminders/`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//             withCredentials: true,
//         });
//         return response.data;
//     } catch (error) {
//         return call_refresh(error, () =>
//             axios.get(`${SERVICES_URL}reminders/`, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//                 withCredentials: true,
//             })
//         );
//     }
// };