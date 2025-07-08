// context/AuthContext.jsx - Korrigierte Export-Struktur:

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

// useAuth Hook als Named Export (für bessere HMR-Kompatibilität)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider Komponente
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start + Listen for token changes across tabs
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('🔍 Found token, verifying user...');
      fetchUser();
    } else {
      console.log('ℹ️ No token found, user not logged in');
      setLoading(false);
    }

    // Listen for storage changes (token updates from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        console.log('🔄 Token changed in another tab, syncing...');
        
        if (e.newValue) {
          // New token was set in another tab
          console.log('✅ New token detected, fetching user data...');
          fetchUser();
        } else {
          // Token was removed in another tab
          console.log('🚪 Token removed in another tab, logging out...');
          setUser(null);
          setLoading(false);
        }
      }
    };

    // Add storage event listener
    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    try {
      console.log('🔍 Fetching user data...');
      const response = await api.get('/auth/users/me');
      console.log('✅ User data fetched:', response.data?.nickname);
      setUser(response.data);
    } catch (error) {
      console.error('❌ Token verification failed:', error.response?.status);
      
      // Bei 401 (Unauthorized) Token automatisch löschen
      if (error.response?.status === 401) {
        console.log('🗑️ Token abgelaufen - lösche automatisch');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      console.log('🔐 AuthContext login called with:', { email, rememberMe });
      
      const response = await api.post('/auth/login', { 
        email, 
        password,
        rememberMe 
      });
      
      const { token, user } = response.data;
      
      console.log('✅ Login response received:', { token: token ? 'present' : 'missing', user: user ? 'present' : 'missing' });
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login fehlgeschlagen'
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 AuthContext register called with:', userData);

      const response = await api.post('/auth/register', userData);

      // Extrahiere token und user direkt nach der Antwort
      const { token, user } = response.data || {};

      console.log('✅ Registration response received:', { token: token ? 'present' : 'missing', user: user ? 'present' : 'missing' });

      // Nur speichern, wenn vorhanden (z.B. nach Sofort-Login)
      if (token && user) {
        localStorage.setItem('token', token);
        setUser(user);
      }
      
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registrierung fehlgeschlagen'
      };
    }
  };

  const logout = () => {
    console.log('🚪 Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Additional helper function for setting token directly if needed
  const setTokenDirectly = (token) => {
    console.log('🔑 Setting token directly');
    localStorage.setItem('token', token);
    fetchUser(); // Fetch user data with the new token
  };

  const value = {
    user,
    login,
    register,
    logout,
    setTokenDirectly,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Default Export der AuthProvider Komponente
export default AuthProvider;

// Named Export für bessere Kompatibilität
export { AuthProvider };

