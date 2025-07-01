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

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔍 Initial token check:', { 
      exists: !!token, 
      length: token?.length, 
      isString: typeof token,
      value: token === 'undefined' ? 'STRING_UNDEFINED' : (token === null ? 'NULL' : 'VALID')
    });
    
    if (token && token !== 'undefined' && token !== 'null' && token.length > 10) {
      fetchUser();
    } else {
      console.log('⚠️ Invalid token found, cleaning up...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setLoading(false);
    }
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

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login...');
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      console.log('✅ Login successful:', { 
        userReceived: !!user, 
        tokenReceived: !!token,
        tokenLength: token?.length 
      });
      
      // Validiere Token vor dem Speichern
      if (!token || token === 'undefined' || token.length < 10) {
        console.error('❌ Invalid token received from server:', token);
        return {
          success: false,
          message: 'Ungültiger Token vom Server erhalten'
        };
      }
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Login fehlgeschlagen'
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Attempting registration...');
      const response = await api.post('/auth/register', userData);
      
      console.log('📥 Registration response:', response.data);
      
      // Bei Registrierung wird möglicherweise kein Token zurückgegeben (wegen E-Mail-Verifizierung)
      if (response.data.token && response.data.user) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
      }
      
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      console.error('❌ Registration failed:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Registrierung fehlgeschlagen'
      };
    }
  };

  const logout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Context Value
  const contextValue = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Default Export der AuthProvider Komponente
export default AuthProvider;

// Named Export für bessere Kompatibilität
export { AuthProvider };

