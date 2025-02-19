import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/';
const LOGIN_URL = `${BASE_URL}token/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`
const APPOINTMENTS_URL = `${BASE_URL}appointments/`
const LOGOUT_URL = `${BASE_URL}logout/`
const AUTH_URL = `${BASE_URL}authenticated/`
const REGISTER_URL = `${BASE_URL}register/`



export const login = async (username, password) => {
    const response = await axios.post(LOGIN_URL,
        {username: username, password: password},
        {withCredentials: true}
    )
    return response.data.success
}
//   try {
//     const response = await axios.post(
//       LOGIN_URL,
//       { username, password },
//       { withCredentials: true }
//     );

//     if (response.status === 200) {
//       const token = response.data.access; // Assuming the response contains an 'access' token
//       return token; // Return the token
//     } else {
//       return null; // Login failed
//     }
//   } catch (error) {
//     console.error("Login Error:", error.response?.data || error.message);
//     return null; // Handle login failure
//   }
// };

export const refresh_token = async () => {
    try{
        await axios.post(REFRESH_URL,
        {},
        {withCredentials: true }
    )
    return true
    } catch (error) {
        return false
    }
}

export const get_appointments = async () => {
    try{
        const response = await axios.get(APPOINTMENTS_URL,
            {withCredentials: true } 
        ) 
        return response.data
    } catch (error) {
        return call_refresh(error, axios.get(APPOINTMENTS_URL, { withCredentials: true} ) )
    }
 
}

const call_refresh = async (error) => {
    if(error.response && error.response.status === 401) {
        const tokenRefreshed = await refresh_token();
        if (tokenRefreshed) {
            const retryResponse = await func();
            return retryResponse.data
        }
    }
    return false
}


export const logout = async () => {
    try{
        await axios.post(LOGOUT_URL,
            {},
            { withCredentials: true }
        )
        return true
    } catch (error) {
        return false
    }
}

export const is_authenticated = async () => {
 try {
    await axios.post(AUTH_URL, {}, { withCredentials: true })
    return true
 }   catch (error) {
    return false
 }
}

export const register = async (username, email, password) => {
    const response = axios .post(REGISTER_URL,
        {username:username, email:email, password:password}, 
        {withCredentials: true}
    )
    return response.data
}