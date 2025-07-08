import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, User, Mail, Lock, MapPin, Loader, CheckCircle } from 'lucide-react';
import './RegisterForm.css';

const RegisterForm = ({ onSuccess = () => {} }) => {
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',      // <-- NEU
    lastName: '',       // <-- NEU
    adress: {
      street: '',
      city: '',
      district: '',
      state: '',
      zip: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'nickname':
        if (!value.trim()) {
          newErrors[name] = 'Nickname ist erforderlich.';
        } else if (value.length < 2) {
          newErrors[name] = 'Nickname muss mindestens 2 Zeichen lang sein.';
        } else {
          delete newErrors[name];
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors[name] = 'E-Mail ist erforderlich.';
        } else if (!emailRegex.test(value)) {
          newErrors[name] = 'Ungültige E-Mail-Adresse.';
        } else {
          delete newErrors[name];
        }
        break;

      case 'password':
        if (!value) {
          newErrors[name] = 'Passwort ist erforderlich.';
        } else if (value.length < 6) {
          newErrors[name] = 'Passwort muss mindestens 6 Zeichen lang sein.';
        } else {
          delete newErrors[name];
        }
        break;

      case 'confirmPassword':
        if (value !== formData.password) {
          newErrors[name] = 'Passwörter stimmen nicht überein.';
        } else {
          delete newErrors[name];
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('adress.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        adress: {
          ...prev.adress,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate all fields (wie gehabt)
    let hasErrors = false;
    if (!formData.nickname?.trim()) {
      setErrors(prev => ({ ...prev, nickname: 'Nickname ist erforderlich' }));
      hasErrors = true;
    }
    if (!formData.email?.trim()) {
      setErrors(prev => ({ ...prev, email: 'E-Mail ist erforderlich' }));
      hasErrors = true;
    }
    if (!formData.password?.trim()) {
      setErrors(prev => ({ ...prev, password: 'Passwort ist erforderlich' }));
      hasErrors = true;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwörter stimmen nicht überein' }));
      hasErrors = true;
    }
    if (!formData.adress.street?.trim()) {
      setErrors(prev => ({ ...prev, 'adress.street': 'Straße ist erforderlich' }));
      hasErrors = true;
    }
    if (!formData.adress.city?.trim()) {
      setErrors(prev => ({ ...prev, 'adress.city': 'Stadt ist erforderlich' }));
      hasErrors = true;
    }
    if (!formData.adress.district?.trim()) {
      setErrors(prev => ({ ...prev, 'adress.district': 'Bezirk ist erforderlich' }));
      hasErrors = true;
    }
    if (!formData.adress.state?.trim()) {
      setErrors(prev => ({ ...prev, 'adress.state': 'Bundesland ist erforderlich' }));
      hasErrors = true;
    }
    if (!formData.adress.zip?.toString().trim()) {
      setErrors(prev => ({ ...prev, 'adress.zip': 'PLZ ist erforderlich' }));
      hasErrors = true;
    }

    if (hasErrors) {
      setIsLoading(false);
      return;
    }

    try {
      // Adresse als Array für das Backend
      const registrationData = {
        nickname: formData.nickname,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName, // Top-Level!
        lastName: formData.lastName,   // Top-Level!
        addresses: [
          {
            street: formData.adress.street,
            city: formData.adress.city,
            district: formData.adress.district,
            state: formData.adress.state,
            zip: formData.adress.zip
          }
        ]
      };

      const result = await register(registrationData);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess(result);
          navigate('/profile');
        }, 2000);
      } else {
        setErrors({ general: result.message || 'Registrierung fehlgeschlagen' });
      }
    } catch (error) {
      setErrors({ general: 'Verbindungsfehler. Bitte versuchen Sie es später erneut.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="register-success">
        <CheckCircle size={64} className="success-icon" />
        <h2>Registrierung erfolgreich!</h2>
        <p>Bitte bestätigen Sie Ihre E-Mail-Adresse.</p>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Registrierung</h2>
          <p>Werden Sie Teil unserer Nachbarschaftsgemeinschaft!</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nickname">
              <User size={20} />
              Nickname
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
              placeholder="Ihr Nickname"
              className={errors.nickname ? 'error' : ''}
            />
            {errors.nickname && <span className="error-text">{errors.nickname}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={20} />
              E-Mail-Adresse
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ihre.email@beispiel.de"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={20} />
              Passwort
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Mindestens 6 Zeichen"
                className={errors.password ? 'error' : ''}
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

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <Lock size={20} />
              Passwort bestätigen
            </label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Passwort wiederholen"
                className={errors.confirmPassword ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <div className="adress-section">
            <h3>
              <MapPin size={20} />
              Adresse
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Vorname (optional)</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Max"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Nachname (optional)</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Mustermann"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="adress.street">Straße & Hausnummer *</label>
                <input
                  type="text"
                  id="adress.street"
                  name="adress.street"
                  value={formData.adress.street}
                  onChange={handleChange}
                  placeholder="Musterstraße 123"
                  required
                  className={errors['adress.street'] ? 'error' : ''}
                />
                {errors['adress.street'] && <span className="error-text">{errors['adress.street']}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="adress.zip">PLZ *</label>
                <input
                  type="number"
                  id="adress.zip"
                  name="adress.zip"
                  value={formData.adress.zip}
                  onChange={handleChange}
                  placeholder="12345"
                  required
                  className={errors['adress.zip'] ? 'error' : ''}
                />
                {errors['adress.zip'] && <span className="error-text">{errors['adress.zip']}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="adress.city">Stadt *</label>
                <input
                  type="text"
                  id="adress.city"
                  name="adress.city"
                  value={formData.adress.city}
                  onChange={handleChange}
                  placeholder="Musterstadt"
                  required
                  className={errors['adress.city'] ? 'error' : ''}
                />
                {errors['adress.city'] && <span className="error-text">{errors['adress.city']}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="adress.district">Bezirk/Ortsteil *</label>
                <input
                  type="text"
                  id="adress.district"
                  name="adress.district"
                  value={formData.adress.district}
                  onChange={handleChange}
                  placeholder="Stadtmitte"
                  required
                  className={errors['adress.district'] ? 'error' : ''}
                />
                {errors['adress.district'] && <span className="error-text">{errors['adress.district']}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="adress.state">Bundesland *</label>
                <input
                  type="text"
                  id="adress.state"
                  name="adress.state"
                  value={formData.adress.state}
                  onChange={handleChange}
                  placeholder="Nordrhein-Westfalen"
                  required
                  className={errors['adress.state'] ? 'error' : ''}
                />
                {errors['adress.state'] && <span className="error-text">{errors['adress.state']}</span>}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`register-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="spinner" size={20} />
                Wird registriert...
              </>
            ) : (
              'Registrieren'
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Haben Sie bereits ein Konto?{' '}
            <Link to="/login" className="login-link">
              Jetzt anmelden
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;