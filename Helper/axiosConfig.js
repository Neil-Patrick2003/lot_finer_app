import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_SETTINGS = {
  baseURL: 'http://192.168.254.106:8000/api/', // Make sure this matches your server
  endpoints: {
    AUTH: 'sanctum/token',       // Removed leading slashes for consistency
    AGENT: 'agent',              // Will become: baseURL + 'agent'
    USER: 'agent/user',          // Will become: baseURL + 'agent/user'
    PROPERTIES: 'agent/properties',
    STORAGE: 'http://192.168.254.106:8000/storage' // For images
  }
};

// Create axios instance with default settings
const axiosInstance = axios.create({
  baseURL: API_SETTINGS.baseURL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Request interceptor for auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      // You might want to add navigation logic here if using React Navigation
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export const API_ENDPOINTS = {  // Remove the duplicate "API_ENDPOINTS ="
  ...API_SETTINGS.endpoints,
  propertyInquiry: (propertyId) => `agent/properties/${propertyId}/inquire`
};