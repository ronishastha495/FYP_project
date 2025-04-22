import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/';
const REFRESH_URL = `${BASE_URL}api/token/refresh/`;
const LOGOUT_URL = `${BASE_URL}auth-app/api/logout/`;
const AUTH_URL = `${BASE_URL}auth-app/api/authenticated/`;
const REGISTER_URL = `${BASE_URL}auth-app/api/register/`;
const LOGIN_URL = `${BASE_URL}auth-app/api/login/`;

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
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data?.is_authenticated) {
            return response.data;
        }
        return false;
    } catch (error) {
        console.error("Authentication check failed:", error.message);
        if (error.response?.status === 401) {
            console.log("Token is invalid or expired");
            const refreshed = await refresh_token();
            if (refreshed) {
                return is_authenticated();
            } else {
                console.log("Refresh token failed, user is not authenticated");
                localStorage.clear();
                return false;
            }
        }
        return false;
    }
};

export const login = async (username, password) => {
    try {
        const response = await axios.post(
            LOGIN_URL,
            { username, password },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
                timeout: 10000
            }
        );

        if (!response.data || !response.data.access || !response.data.refresh) {
            throw new Error('Invalid server response');
        }

        const role = response.data.role || 'customer';

        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("role", role);

        return {
            id: response.data.id,
            access: response.data.access,
            refresh: response.data.refresh,
            user: response.data.user,
            role: role
        };
    } catch (error) {
        console.error("Login error details:", error);
        if (error.response?.status === 401) {
            throw new Error('Invalid credentials');
        } else if (error.response?.status >= 500) {
            throw new Error('Server error, please try again later');
        } else {
            throw new Error(error.response?.data?.detail || 'Authentication failed');
        }
    }
};

export const register = async (userData) => {
    try {
        const {
            username, email, password, confirm_password,
            role, phone_number, address, city, country, profile_picture
        } = userData;

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('confirm_password', confirm_password);
        formData.append('role', role);
        formData.append('phone_number', phone_number);
        formData.append('address', address);
        formData.append('city', city);
        formData.append('country', country);
        if (profile_picture) {
            formData.append('profile_picture', profile_picture);
        }

        const response = await axios.post(REGISTER_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.error("Registration failed:", error.response?.data);
        const errorData = error.response?.data;

        if (error.response?.status === 400) {
            if (errorData.username) {
                throw new Error(`Username error: ${errorData.username.join(', ')}`);
            } else if (errorData.email) {
                throw new Error(`Email error: ${errorData.email.join(', ')}`);
            } else if (errorData.phone_number) {
                throw new Error(`Phone number error: ${errorData.phone_number.join(', ')}`);
            } else if (errorData.password) {
                throw new Error(`Password error: ${errorData.password.join(', ')}`);
            } else if (errorData.confirm_password) {
                throw new Error(`Confirm password error: ${errorData.confirm_password.join(', ')}`);
            } else if (errorData.role) {
                throw new Error(`Role error: ${errorData.role.join(', ')}`);
            } else if (errorData.non_field_errors) {
                throw new Error(errorData.non_field_errors.join(', '));
            } else {
                throw new Error('Invalid registration data');
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
        localStorage.clear();
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

        await axios.post(LOGOUT_URL, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        localStorage.clear();

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

        localStorage.clear();
        return true;
    }
};
