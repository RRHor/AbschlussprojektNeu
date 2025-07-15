import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) setError('');
  };

  // ==== HIER BEGINNT DIE WICHTIGE ÄNDERUNG ====
  // Wir ersetzen die Demo-Login-Logik durch einen echten API-Call
  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      setError('Bitte alle Felder ausfüllen');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Prüfe, ob eine E-Mail oder ein Nickname eingegeben wurde
      const loginPayload = formData.username.includes('@')
        ? { email: formData.username, password: formData.password }
        : { nickname: formData.username, password: formData.password };

      // Sende Login-Request an dein Backend
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login fehlgeschlagen');
        setIsLoading(false);
        return;
      }

      // Speichere Token z.B. im localStorage
      localStorage.setItem('token', data.token);

       // Nach erfolgreichem Login weiterleiten (Pfad ggf. anpassen!)
      navigate('/profile');
    } catch (err) {
      setError('Serverfehler beim Login');
    } finally {
      setIsLoading(false);
    }
    
    // Simulation für Demo
    // setTimeout(() => {
    //   console.log('Login attempt:', { username: formData.username, password: formData.password });
    //   setIsLoading(false);
    //   alert('Login erfolgreich! (Demo)');
    //   // Nach erfolgreichem Login weiterleiten:
    //   // navigate('/dashboard');
    // }, 1500);
  };

  // ==== HIER ENDET DIE WICHTIGE ÄNDERUNG ====

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Bitte E-Mail-Adresse eingeben');
      return;
    }

    // E-Mail-Format validieren
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Hier würdest du deine Passwort-Reset-Logik implementieren
      // Simulation für Demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Password reset for:', formData.email);
      setSuccessMessage('📧 E-Mail wurde gesendet! Sie werden zur Bestätigungsseite weitergeleitet...');
      
      // Nach 2 Sekunden zur ausführlichen ForgotPassword-Seite weiterleiten
      setTimeout(() => {
        navigate('/forgot-password', { 
          state: { email: formData.email } // E-Mail-Adresse mitgeben
        });
      }, 2000);
      
    } catch (error) {
      setError('Fehler beim Senden der E-Mail. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (showForgotPassword) {
        handleForgotPassword();
      } else {
        handleLogin();
      }
    }
  };

  const goBack = () => {
    window.history.back();
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
                ? 'Gib deine E-Mail-Adresse ein um fortzufahren'
                : 'Logge dich ein, um fortzufahren und der Nachbartschaft zu helfen.'
              }
            </p>
          </div>

          {/* Form Content */}
          <div className="login-card-content">
            {/* Login Form */}
            {!showForgotPassword ? (
              <div className="form-section login-form">
                {/* Username Field */}
                <div className="input-group">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Benutzername"
                    value={formData.username}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    required
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="error-message">
                    ❌ {error}
                  </div>
                )}

                {/* Remember Me & Forgot Password */}
                <div className="form-options">
                  <label className="remember-me-checkbox">
                    <input type="checkbox" />
                    <span>Angemeldet bleiben</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="forgot-password-link"
                  >
                    Passwort vergessen?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="submit-button primary-button"
                >
                  {isLoading ? (
                    <div className="spinner-container">
                      <div className="spinner"></div>
                      Anmelden...
                    </div>
                  ) : (
                    'Anmelden'
                  )}
                </button>
              </div>
            ) : (
              /* Forgot Password Form */
              <div className="form-section forgot-password-form">
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
                  />
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="error-message">
                    ❌ {error}
                  </div>
                )}
                
                {successMessage && (
                  <div className="success-message">
                    {successMessage}
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
                    onClick={handleForgotPassword}
                    disabled={isLoading || successMessage}
                    className="submit-button primary-button"
                  >
                    {isLoading ? (
                      <div className="spinner-container">
                        <div className="spinner"></div>
                        Senden...
                      </div>
                    ) : successMessage ? (
                      'Weiterleitung...'
                    ) : (
                      'E-Mail senden'
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setError('');
                      setSuccessMessage('');
                    }}
                    className="submit-button secondary-button"
                    disabled={isLoading || successMessage}
                  >
                    Zurück zum Login
                  </button>

                  {/* Link zur ausführlichen Seite */}
                  <button
                    onClick={() => navigate('/forgot-password')}
                    className="link-button"
                    disabled={isLoading || successMessage}
                  >
                    Zur ausführlichen Passwort-Zurücksetzen-Seite →
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="card-footer">
              <div className="separator">
                <span>oder</span>
              </div>
              <p className="register-prompt">
                Noch kein Konto? 
                <a href="/register" className="register-link">
                  Jetzt registrieren
                </a>
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