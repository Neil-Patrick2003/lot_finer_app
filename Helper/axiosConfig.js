import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_SETTINGS = {
  baseURL: 'https://test.nutrisafari.xyz/api/',
  endpoints: {
    AUTH: 'sanctum/token',
    AGENT: 'agent',
    USER: 'agent/user',
    PROPERTIES: 'agent/properties',
    STORAGE: 'https://test.nutrisafari.xyz/storage',
    LIST: 'agent/listing',
    INQUIRIES: 'agent/inquiries',
    INQUIRIES2: (id, action) => `agent/inquiries/${id}/${action}`,
    PROPERTY_DETAIL: (id) => `agent/listing/${id}`
  }
};

const axiosInstance = axios.create({
  baseURL: API_SETTINGS.baseURL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Token error:', error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      // Add navigation to login if needed
    }
    return Promise.reject({
      message: error.response?.data?.message || 'Network Error',
      status: error.response?.status
    });
  }
);

export default axiosInstance;
export const API_ENDPOINTS = {
  ...API_SETTINGS.endpoints
  
};