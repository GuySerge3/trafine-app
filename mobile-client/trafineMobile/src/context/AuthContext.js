import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Réinitialiser le token au démarrage
        await AsyncStorage.removeItem('token');
        setUserToken(null);
      } catch (e) {
        console.error("Erreur lors de la réinitialisation du token:", e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (token) => {
    setUserToken(token);
    await AsyncStorage.setItem('token', token);
    console.log("✅ Token stocké dans le contexte et AsyncStorage");
  };

  const logout = async () => {
    setUserToken(null);
    await AsyncStorage.removeItem('token');
    console.log("🔓 Déconnexion effectuée");
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
