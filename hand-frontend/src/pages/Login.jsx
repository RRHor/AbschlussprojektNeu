import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader } from 'lucide-react'; 
import { useAuth } from '../context/AuthContext';
import api from '../api.js';  // ← DIESE ZEILE HINZUFÜGEN!
import './Login.css'; 

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    resetEmail: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Bitte alle Felder ausfüllen');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/profile', { replace: true });
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
          setError(result.message || 'Login fehlgeschlagen');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Ein unerwarteter Fehler ist aufgetreten');
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
      {/* Background Pattern */}
      <div className="background-pattern-container">
        <div className="background-pattern"></div>
      </div>

      {/* Login Container */}
      <div className="login-main-container">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="back-button"
          type="button"
        >
          <ArrowLeft size={20} className="back-button-icon" />
          Zurück
        </button>

        {/* Main Card */}
        <div className="login-card">
          {/* Header with Gradient */}
          <div className="login-card-header">
            <div className="header-icon-wrapper">
              <User size={32} className="header-icon" />
            </div>
            <h1 className="header-title">
              {showForgotPassword ? 'Passwort zurücksetzen' : 'Willkommen zurück'}
            </h1>
            <p className="header-subtitle">
              {showForgotPassword 
                ? 'Gib deine E-Mail-Adresse ein, um dein Passwort zurückzusetzen'
                : 'Logge dich ein, um fortzufahren und der Nachbartschaft zu helfen.'
              }
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {/* Form Content */}
          <div className="login-card-content">
            {/* Login Form */}
            {!showForgotPassword ? (
              <form onSubmit={handleLogin} className="form-section login-form">
                {/* Email Field */}
                <div className="input-group">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="E-Mail-Adresse"
                    value={formData.email}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    required
                    autoComplete="email"
                  />
                </div>

                {/* Password Field */}
                <div className="input-group">
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Passwort"
                    value={formData.password}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="form-options">
                  <label className="remember-me-checkbox">
                    <input type="checkbox" name="rememberMe" />
                    <span>Angemeldet bleiben</span>
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="submit-button primary-button"
                >
                  {isLoading ? (
                    <div className="spinner-container">
                      <Loader size={20} className="spinner" />
                      Anmelden...
                    </div>
                  ) : (
                    'Anmelden'
                  )}
                </button>

                {/* Forgot Password Link */}
                <div className="form-footer">
                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setError('');
                    }}
                  >
                    Passwort vergessen?
                  </button>
                </div>
              </form>
            ) : (
              /* Forgot Password Form */
              <form onSubmit={handleForgotPassword} className="form-section forgot-password-form">
                {/* Email Field */}
                <div className="input-group">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    name="resetEmail"
                    placeholder="E-Mail-Adresse"
                    value={formData.resetEmail}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    required
                    autoComplete="email"
                  />
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="error-message">
                    ❌ {error}
                  </div>
                )}

                {/* Info Text */}
                <div className="info-box">
                  <p>
                    📧 Du erhältst eine E-Mail mit einem Link zum Zurücksetzen deines Passworts.
                  </p>
                </div>

                {/* Buttons */}
                <div className="button-group">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="submit-button primary-button"
                  >
                    {isLoading ? (
                      <div className="spinner-container">
                        <Loader size={20} className="spinner" />
                        Senden...
                      </div>
                    ) : (
                      'E-Mail senden'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setError('');
                      setFormData(prev => ({ ...prev, resetEmail: '' }));
                    }}
                    className="submit-button secondary-button"
                    disabled={isLoading}
                  >
                    Zurück zum Login
                  </button>

                  {/* Link zur ausführlichen Seite */}
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="link-button"
                    disabled={isLoading}
                  >
                    Zur ausführlichen Passwort-Zurücksetzen-Seite →
                  </button>
                </div>
              </form>
            )}

            {/* Footer */}
            <div className="card-footer">
              <div className="separator">
                <span>oder</span>
              </div>
              <p className="register-prompt">
                Noch kein Konto? 
                <Link to="/register" className="register-link">
                  Jetzt registrieren
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="additional-info">
          <p>
            🔒 Deine Daten sind sicher und werden verschlüsselt übertragen
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;