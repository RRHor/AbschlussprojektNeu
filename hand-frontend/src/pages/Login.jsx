import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api.js';  // ← DIESE ZEILE HINZUFÜGEN!
import './Login.css'; 
import { Eye, EyeOff, Loader } from 'lucide-react';
import Footer from '../components/Footer';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('🔐 Logging in with:', { email: formData.email, rememberMe });
      
      // Use AuthContext login function
      const result = await login(formData.email, formData.password, rememberMe);
      
      if (result.success) {
        console.log('✅ Login successful, navigating to profile');
        navigate('/profile');
      } else {
        // NEU: Spezielle Behandlung für unverifizierte E-Mails
        if (result.requiresVerification) {
          setError(
            <>
              {result.message}
              <br />
              <button 
                onClick={() => handleResendVerification(result.email)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#ff6b6b', 
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Verifizierungs-E-Mail erneut senden
              </button>
            </>
          );
        } else {        
          console.error('❌ Login failed:', result.message);
          setError(result.message || 'Login fehlgeschlagen');
        }      
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Verbindungsfehler. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.resetEmail) {
      setError('Bitte E-Mail-Adresse eingeben');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/forgot-password', { 
        email: formData.resetEmail 
      });
      
      if (response.data.success) {
        alert('✅ Reset-E-Mail gesendet! Schaue in die Backend-Console für den Link.');
        setShowForgotPassword(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Fehler beim Senden');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (showForgotPassword) {
        handleForgotPassword(e);
      } else {
        handleLogin(e);
      }
    }
  };

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleResendVerification = async (email) => {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      alert('Neue Verifizierungs-E-Mail wurde gesendet!');
    } catch (error) {
      alert('Fehler beim Senden der E-Mail.');
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="background-pattern-container">
        <div className="background-pattern"></div>
      </div>
      
      <div className="login-card">
        <div className="login-card-header">
          <h2>Anmelden</h2>
          <p>Willkommen zurück in der Nachbarschaft!</p>
        </div>

        <div className="login-card-content">
          <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">E-Mail-Adresse</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ihre.email@beispiel.de"
              className={errors.email ? 'error' : ''}
              autoComplete="off"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Ihr Passwort"
                className={errors.password ? 'error' : ''}
                autoComplete="off"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-actions">
            <div className="remember-me-container">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="remember-me-checkbox"
              />
              <label htmlFor="rememberMe" className="remember-me-label">
                Angemeldet bleiben
              </label>
            </div>
            
            <Link to="/forgot-password" className="forgot-password-link">
              Passwort vergessen?
            </Link>
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="spinner" size={20} />
                Wird angemeldet...
              </>
            ) : (
              'Anmelden'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Noch kein Konto?{' '}
            <Link to="/register" className="register-link">
              Jetzt registrieren
            </Link>
          </p>
        </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;