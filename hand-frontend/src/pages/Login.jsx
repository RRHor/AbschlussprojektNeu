import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader } from 'lucide-react';
import './Login.css';
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
        console.error('❌ Login failed:', result.message);
        setError(result.message || 'Login fehlgeschlagen');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Verbindungsfehler. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false);
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