import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with default config
const instance = axios.create({
  baseURL: process.env.REACT_APP_API || 'http://localhost:8080/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timed out. Please try again.');
    } else if (error.response?.status === 401) {
      localStorage.removeItem('auth');
      window.location.href = '/login';
    } else if (error.response?.status === 404) {
      toast.error('API endpoint not found. Please check the configuration.');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
    return Promise.reject(error);
  }
);

export default instance; 