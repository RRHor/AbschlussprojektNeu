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
    address: {
      street: '',
      city: '',
      district: '',
      state: '',
      zipCode: '',
      firstName: '',
      lastName: ''
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
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Validate field
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 FORM SUBMITTED! Starting registration process...');
    console.log('📝 Current formData:', formData);
    
    setIsLoading(true);

    // Validate all fields
    console.log('🔍 Starting validation...');
    let hasErrors = false;
    
    // Check required fields
    if (!formData.nickname?.trim()) {
      console.log('❌ Nickname is empty');
      setErrors(prev => ({ ...prev, nickname: 'Nickname ist erforderlich' }));
      hasErrors = true;
    }
    
    if (!formData.email?.trim()) {
      console.log('❌ Email is empty');
      setErrors(prev => ({ ...prev, email: 'E-Mail ist erforderlich' }));
      hasErrors = true;
    }
    
    if (!formData.password?.trim()) {
      console.log('❌ Password is empty');
      setErrors(prev => ({ ...prev, password: 'Passwort ist erforderlich' }));
      hasErrors = true;
    }
    
    if (formData.password !== formData.confirmPassword) {
      console.log('❌ Passwords do not match');
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwörter stimmen nicht überein' }));
      hasErrors = true;
    }

    // Check required address fields
    if (!formData.address.street?.trim()) {
      console.log('❌ Street is empty');
      setErrors(prev => ({ ...prev, 'address.street': 'Straße ist erforderlich' }));
      hasErrors = true;
    }
    
    if (!formData.address.city?.trim()) {
      console.log('❌ City is empty');
      setErrors(prev => ({ ...prev, 'address.city': 'Stadt ist erforderlich' }));
      hasErrors = true;
    }
    
    if (!formData.address.district?.trim()) {
      console.log('❌ District is empty');
      setErrors(prev => ({ ...prev, 'address.district': 'Bezirk ist erforderlich' }));
      hasErrors = true;
    }
    
    if (!formData.address.state?.trim()) {
      console.log('❌ State is empty');
      setErrors(prev => ({ ...prev, 'address.state': 'Bundesland ist erforderlich' }));
      hasErrors = true;
    }
    
    if (!formData.address.zipCode?.toString().trim()) {
      console.log('❌ ZipCode is empty');
      setErrors(prev => ({ ...prev, 'address.zipCode': 'PLZ ist erforderlich' }));
      hasErrors = true;
    }

    console.log('🔍 Form validation result:', !hasErrors);

    if (hasErrors) {
      console.log('❌ Form validation failed, stopping registration');
      setIsLoading(false);
      return;
    }

    try {
      console.log('📝 Registering user with data:', formData);
      
      // Prepare data for backend - convert address to addresses array and zipCode to number
      const registrationData = {
        nickname: formData.nickname,
        email: formData.email,
        password: formData.password,
<<<<<<< HEAD
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        adress: {
          street: formData.street,
          city: formData.city,
          district: formData.district || "",
          zip: formData.zipCode || "",     // ← KORRIGIERT: zip statt zipCode + Fallback
          state: formData.state
        }
      };
      console.log('📋 Registration data being sent:', JSON.stringify(registrationData, null, 2));
      console.log('🏠 Address being sent:', registrationData.adress);
      console.log('🔍 ZIP being sent:', registrationData.adress.zip);  // ← Neuer Debug
=======
        addresses: [{
          street: formData.address.street,
          city: formData.address.city,
          district: formData.address.district,
          state: formData.address.state,
          zipCode: parseInt(formData.address.zipCode) || 0,
          firstName: formData.address.firstName,
          lastName: formData.address.lastName
        }]
      };

      console.log('📤 Sending registration data:', registrationData);

      // Use AuthContext register function (which uses api.js with axios)
>>>>>>> eeae62961113e322caa88b02f7672ee49b752f1e
      const result = await register(registrationData);
      console.log('📥 Registration result:', result);

      if (result.success) {
        console.log('✅ Registration successful');
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess(result);
          navigate('/profile');
        }, 2000);
      } else {
        console.error('❌ Registration failed:', result.message);
        setErrors({ general: result.message || 'Registrierung fehlgeschlagen' });
      }
    } catch (error) {
      console.error('Registration error:', error);
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

          <div className="address-section">
            <h3>
              <MapPin size={20} />
              Adresse
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.firstName">Vorname (optional)</label>
                <input
                  type="text"
                  id="address.firstName"
                  name="address.firstName"
                  value={formData.address.firstName}
                  onChange={handleChange}
                  placeholder="Max"
                />
              </div>
              <div className="form-group">
                <label htmlFor="address.lastName">Nachname (optional)</label>
                <input
                  type="text"
                  id="address.lastName"
                  name="address.lastName"
                  value={formData.address.lastName}
                  onChange={handleChange}
                  placeholder="Mustermann"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.street">Straße & Hausnummer *</label>
                <input
                  type="text"
                  id="address.street"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Musterstraße 123"
                  required
                  className={errors['address.street'] ? 'error' : ''}
                />
                {errors['address.street'] && <span className="error-text">{errors['address.street']}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.zipCode">PLZ *</label>
                <input
                  type="number"
                  id="address.zipCode"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  placeholder="12345"
                  required
                  className={errors['address.zipCode'] ? 'error' : ''}
                />
                {errors['address.zipCode'] && <span className="error-text">{errors['address.zipCode']}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="address.city">Stadt *</label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="Musterstadt"
                  required
                  className={errors['address.city'] ? 'error' : ''}
                />
                {errors['address.city'] && <span className="error-text">{errors['address.city']}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.district">Bezirk/Ortsteil *</label>
                <input
                  type="text"
                  id="address.district"
                  name="address.district"
                  value={formData.address.district}
                  onChange={handleChange}
                  placeholder="Stadtmitte"
                  required
                  className={errors['address.district'] ? 'error' : ''}
                />
                {errors['address.district'] && <span className="error-text">{errors['address.district']}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="address.state">Bundesland *</label>
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="Nordrhein-Westfalen"
                  required
                  className={errors['address.state'] ? 'error' : ''}
                />
                {errors['address.state'] && <span className="error-text">{errors['address.state']}</span>}
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