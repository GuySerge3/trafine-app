import React, { createContext, useState } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      setUser(res.data.user); // ou res.data selon ton retour backend
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Erreur lors de la connexion');
    }
  };

  const register = async (email, password) => {
    try {
      await api.post('/api/auth/register', { email, password });
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Erreur lors de l\'inscription');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
