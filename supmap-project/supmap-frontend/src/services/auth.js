import api, { setAuthToken } from './api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { token } = response.data;
  setAuthToken(token);
  localStorage.setItem('token', token);
};

export const logout = () => {
  localStorage.removeItem('token');
  setAuthToken(null);
};