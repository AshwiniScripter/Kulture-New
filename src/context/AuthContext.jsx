import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);
const STORAGE_KEY = 'kv_user_session';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const result = await authService.getProfile();
      if (result && result.success) {
        setUser(result.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
        return result.user;
      }
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    } catch {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authService.login(email, password);
    if (result && result.success) {
      setUser(result.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
    }
    return result;
  }, []);

  const register = useCallback(async (data) => {
    const result = await authService.register(data);
    if (result && result.success) {
      setUser(result.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export { AuthProvider, useAuth };
