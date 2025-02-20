import axios from 'axios';

// Base URL and API endpoints
const BASE_URL = 'http://127.0.0.1:8000/api/';
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
        LOGIN_URL,
        { username, password },
        { withCredentials: true }
    );
    return response.data.success;
};

/**
 * Refreshes the authentication token if expired.
 */
export const refresh_token = async () => {
    try {
        await axios.post(REFRESH_URL, {}, { withCredentials: true });
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Fetches a list of user appointments.
 * If unauthorized (401), tries to refresh the token and retry.
 */
export const get_appointments = async () => {
    try {
        const response = await axios.get(APPOINTMENTS_URL, { withCredentials: true });
        return response.data;
    } catch (error) {
        return call_refresh(error, () =>
            axios.get(APPOINTMENTS_URL, { withCredentials: true })
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

/**
 * Logs out the authenticated user.
 */
export const logout = async () => {
    try {
        await axios.post(LOGOUT_URL, {}, { withCredentials: true });
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Checks if the user is authenticated.
 */
export const is_authenticated = async () => {
    try {
        await axios.post(AUTH_URL, {}, { withCredentials: true });
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Registers a new user.
 */
export const register = async (username, email, password) => {
    const response = await axios.post(
        REGISTER_URL,
        { username, email, password },
        { withCredentials: true }
    );
    return response.data;
};
