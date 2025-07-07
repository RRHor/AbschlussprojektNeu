import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
console.log('🔧 API_URL configured as:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request-Interceptor: Token und Debug kombiniert
api.interceptors.request.use((config) => {
  console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
  
  const token = localStorage.getItem('token');
  
  // Token-Validierung VOR dem Setzen
  if (token && token !== 'undefined' && token !== 'null' && token.length > 10) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🎫 Token added to request (length:', token.length, ')');
  } else {
    console.log('⚠️ No valid token found:', { 
      exists: !!token, 
      value: token === 'undefined' ? 'STRING_UNDEFINED' : token?.substring(0, 10) + '...',
      length: token?.length 
    });
    
    // Entferne Authorization header falls vorhanden
    delete config.headers.Authorization;
    
    // Korrupte Tokens automatisch löschen
    if (token === 'undefined' || token === 'null') {
      console.log('🗑️ Removing corrupted token from localStorage');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response-Interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    
    // Bei 401 (Unauthorized) Token automatisch löschen
    if (error.response?.status === 401) {
      console.log('🗑️ 401 Error - Removing invalid token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Optional: Redirect to login (außer wenn bereits auf login/register)
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        console.log('🔄 Redirecting to login...');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;