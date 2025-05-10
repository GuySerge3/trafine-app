import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const routeApi = axios.create({
  baseURL: 'http://192.168.1.48:3003',
  timeout: 30000, // 30s pour éviter les timeout
});

routeApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default routeApi;
