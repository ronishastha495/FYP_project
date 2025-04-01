import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/';
const REFRESH_URL = `${BASE_URL}token/refresh/`;
const LOGOUT_URL = `${BASE_URL}account/logout/`;
const AUTH_URL = `${BASE_URL}account/authenticated/`;
const REGISTER_URL = `${BASE_URL}account/register/`;
const LOGIN_URL = `${BASE_URL}account/login/`;

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

        if (response.data && response.data.access) {
            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);
            // Make sure your backend returns role in this structure
            localStorage.setItem("role", response.data.user?.role || response.data.role);
            return response.data;
        }else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error("Login failed:", error.message);
        if (error.response?.status === 401) {
            throw new Error('Invalid credentials');
        } else if (!navigator.onLine) {
            throw new Error('Network connection error');
        } else {
            throw new Error('Server connection error');
        }
    }
};

export const register = async (username, email, password, role) => {
    try {
        const response = await axios.post(REGISTER_URL, 
            { username, email, password, role }, 
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("Registration failed:", error.response?.data);
        throw error; // Rethrow to handle in the component
    }
};

export const refresh_token = async () => {
    try {
        const refreshToken = getRefreshToken();
        const response = await axios.post(REFRESH_URL, { refresh: refreshToken }, { withCredentials: true });
        localStorage.setItem("accessToken", response.data.access);
        return true;
    } catch (error) {
        console.error("Token refresh failed:", error.response?.data);
        return false;
    }
};

export const logout = async () => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
            console.warn("No refresh token found.");
            return false;
        }

        await axios.post(LOGOUT_URL, 
            { refresh_token: refreshToken }, 
            { 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                withCredentials: true 
            }
        );

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        
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
