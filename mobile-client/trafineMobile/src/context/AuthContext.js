import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setUserToken(storedToken);
          console.log("🔐 Token restauré depuis AsyncStorage");
        }
      } catch (e) {
        console.error("❌ Erreur lors de la récupération du token :", e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (token) => {
    try {
      setUserToken(token);
      await AsyncStorage.setItem('token', token);
      console.log("✅ Token stocké avec succès");
    } catch (e) {
      console.error("❌ Erreur lors du stockage du token :", e);
    }
  };

  const register = async (email, password) => {
    try {
      const response = await api.post('/api/auth/register', { email, password });
      console.log('✅ Inscription réussie', response.data);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.error || error.message || 'Erreur inconnue';
      console.error('❌ Erreur d’inscription :', msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      setUserToken(null);
      await AsyncStorage.removeItem('token');
      console.log("🔓 Déconnecté");
    } catch (e) {
      console.error("❌ Erreur de déconnexion :", e);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
