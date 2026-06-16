import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('rw_token');
    const savedUser = localStorage.getItem('rw_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (tokenVal, userData) => {
    setToken(tokenVal);
    setUser(userData);
    localStorage.setItem('rw_token', tokenVal);
    localStorage.setItem('rw_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('rw_user', JSON.stringify(updated));
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      updateUser(data.user);
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
