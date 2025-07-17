import { useState, useContext } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css'; 

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // <--- NEU
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
    if (error) setError('');
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      setError('Bitte alle Felder ausfüllen');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // const response = await fetch('http://localhost:5000/api/auth/login', {
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     nickname: formData.username,
      //     password: formData.password
      //   })
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || 'Login fehlgeschlagen');
      // }

      // // ✅ Token & User im localStorage speichern
      // localStorage.setItem('token', data.token);
      // localStorage.setItem('currentUser', JSON.stringify(data.user));

      // console.log('✅ Eingeloggt als:', data.user.nickname);

      const result = await login(formData.username, formData.password);

      if (!result.success) {
        throw new Error(result.message || 'Login fehlgeschlagen');
      }

      console.log('✅ Eingeloggt!');
      // Weiterleitung nach Login
      // navigate('/dashboard'); // Passe das Ziel ggf. an
      navigate('/profile');


    } catch (err) {
      console.error('❌ Login-Fehler:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Bitte E-Mail-Adresse eingeben');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simuliere Senden der E-Mail
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('📧 Passwort-Reset für:', formData.email);
      setSuccessMessage('📧 E-Mail wurde gesendet! Sie werden zur Bestätigungsseite weitergeleitet...');

      setTimeout(() => {
        navigate('/forgot-password', {
          state: { email: formData.email }
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
      showForgotPassword ? handleForgotPassword() : handleLogin();
    }
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="login-page-wrapper">
      <div className="background-pattern-container">
        <div className="background-pattern"></div>
      </div>

      <div className="login-main-container">
        <button onClick={goBack} className="back-button">
          <ArrowLeft size={20} className="back-button-icon" />
          Zurück
        </button>

        <div className="login-card">
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
                : 'Logge dich ein, um fortzufahren und der Nachbartschaft zu helfen.'}
            </p>
          </div>

          <div className="login-card-content">
            {!showForgotPassword ? (
              <div className="form-section login-form">
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

                {error && <div className="error-message">❌ {error}</div>}

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
              <div className="form-section forgot-password-form">
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

                {error && <div className="error-message">❌ {error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <div className="info-box">
                  <p>📧 Du erhältst eine E-Mail mit einem Link zum Zurücksetzen deines Passworts.</p>
                </div>

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

            <div className="card-footer">
              <div className="separator">
                <span>oder</span>
              </div>
              <p className="register-prompt">
                Noch kein Konto?
                <a href="/register" className="register-link"> Jetzt registrieren</a>
              </p>
            </div>
          </div>
        </div>

        <div className="additional-info">
          <p>🔒 Deine Daten sind sicher und werden verschlüsselt übertragen</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
