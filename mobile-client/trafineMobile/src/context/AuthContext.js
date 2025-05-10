import React, { createContext, useState } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  // ✅ Stocke simplement le token reçu (ne fait plus d'appel à l'API ici)
  const login = (token) => {
    setUserToken(token);
    console.log("✅ Token stocké dans le contexte");
  };

  // ✅ Appel API pour l'inscription
  const register = async (email, password) => {
    try {
      const res = await api.post('/api/auth/register', { email, password });
      console.log('✅ Inscription réussie', res.data);
    } catch (err) {
      console.error('❌ Erreur d’inscription:', err.response?.data || err.message);
      throw err;
    }
  };

  // ✅ Déconnexion simple
  const logout = () => {
    setUserToken(null);
    console.log("🔓 Déconnexion effectuée");
  };

  return (
    <AuthContext.Provider value={{ userToken, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
