import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);  // initial auth check
  const [toasts, setToasts]   = useState([]);
  const toastId = useRef(0);

  // On mount — check if we have a token and fetch user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const setToken = useCallback((token) => {
    localStorage.setItem('token', token);
    api.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => logout());
  }, [logout]);

  const showToast = useCallback((message, type = 'info') => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, setToken, toasts, showToast }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
