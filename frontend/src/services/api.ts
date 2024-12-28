import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Flask backend URL

const api = axios.create({
  baseURL: API_URL,
});

// Lägg till en interceptor för att inkludera JWT-token i varje begäran
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
