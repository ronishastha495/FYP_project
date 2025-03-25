// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000/services/', // Adjust to your Django API URL
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add token interceptor if using authentication
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token'); // Assuming token is stored
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default {
//   get: (url) => api.get(url),
//   post: (url, data) => api.post(url, data),
//   put: (url, data) => api.put(url, data),
//   delete: (url) => api.delete(url),
// };