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
    const token = localStorage.getItem("accessToken");
    if (!token) {
        console.log("No access token found, user is not authenticated");
        return false;
    }
    
    try {
        const response = await axios.get(AUTH_URL, { 
            headers: { Authorization: `Bearer ${token}` } 
        });
        // Return the data which includes the role
        return response.data;
    } catch (error) {
        console.error("Authentication check failed:", error.message);
        // Don't remove tokens here, let the auth context handle that
        // to avoid race conditions with token refresh
        if (error.response?.status === 401) {
            console.log("Token is invalid or expired");
            // Try refresh token instead of immediately removing tokens
            const refreshed = await refresh_token();
            if (refreshed) {
                // Try authentication again with new token
                return is_authenticated();
            } else {
                console.log("Refresh token failed, user is not authenticated");
                // Now it's safe to remove tokens
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
        }
        return false;
    }
};

export const login = async (username, password) => {
    try {
        const response = await axios.post(LOGIN_URL, 
            { username, password }, 
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
                timeout: 10000 
            }
        );

        if (!response.data || !response.data.access || !response.data.refresh) {
            console.error("Invalid response structure:", response.data);
            throw new Error('Invalid server response');
        }

        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        
        const role = response.data.user?.role || response.data.role || 'user'; 
        localStorage.setItem("role", role);
        
        return {
            access: response.data.access,
            refresh: response.data.refresh,
            user: response.data.user || response.data.username,
            role: role
        };
        
    } catch (error) {
        console.error("Login error details:", {
            message: error.message,
            response: error.response?.data,
            code: error.code,
            config: error.config
        });

        if (error.response) {
            if (error.response.status === 401) {
                throw new Error('Invalid credentials');
            }
            if (error.response.status >= 500) {
                throw new Error('Server error, please try again later');
            }
            throw new Error(error.response.data?.detail || 'Authentication failed');
        } else if (error.request) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout, please check your connection');
            }
            throw new Error('Network error, please check your connection');
        } else {
            throw new Error('Login failed: ' + error.message);
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
        
        // Provide more specific error messages
        if (error.response) {
            if (error.response.status === 400) {
                // Handle validation errors from backend
                const errorData = error.response.data;
                if (errorData.username) {
                    throw new Error(`Username error: ${errorData.username.join(', ')}`);
                } else if (errorData.email) {
                    throw new Error(`Email error: ${errorData.email.join(', ')}`);
                } else if (errorData.password) {
                    throw new Error(`Password error: ${errorData.password.join(', ')}`);
                } else if (errorData.non_field_errors) {
                    throw new Error(errorData.non_field_errors.join(', '));
                }
            }
        }
        
        throw error; 
    }
};

export const refresh_token = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        console.error("No refresh token available");
        return false;
    }

    try {
        const response = await axios.post(
            REFRESH_URL, 
            { refresh: refreshToken }, 
            { 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.data?.access) {
            throw new Error('Invalid refresh response');
        }

        localStorage.setItem("accessToken", response.data.access);
        return true;
    } catch (error) {
        console.error("Token refresh failed:", error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        return false;
    }
};

export const logout = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.log("No access token found for logout");
            return false;
        }

        // Try to hit the server logout endpoint with proper headers
        await axios.post(LOGOUT_URL, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        
        // Always clear local storage and cookies regardless of server response
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
        
        // Even if server logout fails, clear local tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        return true; // Return true anyway since we've cleared local tokens
    }
};

const call_refresh = async (error, func) => {
    if (error.response?.status === 401) {
        const refreshed = await refresh_token();
        if (refreshed) return await func();
    }
    return false;
};
