import axios from 'axios';

// The base URL for our backend API
const API_URL = 'https://slotswapper-backend-pup9.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

// --- Interceptor to add the auth token to requests ---
// This function will run before every request
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('token');
    
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;