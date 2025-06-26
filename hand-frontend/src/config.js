// API Base URL - bereits mit /api Pfad
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Weitere Konfigurationen
export const CONFIG = {
  API_URL: API_URL,
  API_TIMEOUT: 10000, // 10 Sekunden
  APP_NAME: 'Hand in Hand',
  DEFAULT_AVATAR: '/default-avatar.png'
};

// Hilfsfunktion für API-Endpoints
export const getApiUrl = (endpoint) => `${API_URL}${endpoint}`;

// Beispiel-Verwendung:
// getApiUrl('/auth/login') → 'http://localhost:4000/api/auth/login'