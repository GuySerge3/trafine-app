import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔐 Service Authentification (port 3001)
const api = axios.create({
  baseURL: 'http://192.168.1.48:3001',
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔐 Service Incidents (port 3004)
const incidentApi = axios.create({
  baseURL: 'http://192.168.1.48:3004',
  timeout: 10000,
});

incidentApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Export nommés (plus flexible)
export { api, incidentApi };
