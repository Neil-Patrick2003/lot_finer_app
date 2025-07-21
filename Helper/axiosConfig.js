import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosConfig = axios.create({
    baseURL: 'http://192.168.0.109/api/',
  timeout: 10000,
});

// ✅ Auto-attach Bearer token to all requests
axiosConfig.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosConfig;
