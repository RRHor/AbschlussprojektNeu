import axios from 'axios';
import { API_URL } from './config.js';

// Zentrale axios-Instanz erstellen
const api = axios.create({
  baseURL: API_URL, // HIER: Ändere diese Zeile!
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request-Interceptor für automatisches Token-Handling
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response-Interceptor für Error-Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;