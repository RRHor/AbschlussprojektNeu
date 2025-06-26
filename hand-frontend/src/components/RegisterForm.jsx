import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, User, Mail, Lock, MapPin, Loader, CheckCircle } from 'lucide-react';
import './RegisterForm.css';
import logo from '../assets/logo.png';

const RegisterForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '', // Passwort-Bestätigung
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    district: '',
    zip: '',
    state: '',
  });

  const [touchedFields, setTouchedFields] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
    
    // Validate on blur
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    const errors = { ...formErrors };
    
    switch (fieldName) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[fieldName] = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
        } else {
          delete errors[fieldName];
        }
        break;
      
      case 'password':
        if (value.length < 6) {
          errors[fieldName] = 'Passwort muss mindestens 6 Zeichen lang sein.';
        } else {
          delete errors[fieldName];
        }
        break;
      
      case 'confirmPassword':
        if (value !== formData.password) {
          errors[fieldName] = 'Passwörter stimmen nicht überein.';
        } else {
          delete errors[fieldName];
        }
        break;
      
      case 'zip':
        if (value && (value.length !== 5 || !/^\d+$/.test(value))) {
          errors[fieldName] = 'PLZ muss genau 5 Ziffern haben.';
        } else {
          delete errors[fieldName];
        }
        break;
      
      default:
        if (!value.trim()) {
          errors[fieldName] = 'Dieses Feld ist erforderlich.';
        } else {
          delete errors[fieldName];
        }
    }
    
    setFormErrors(errors);
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields - ALLE Felder jetzt required
    const requiredFields = [
      'nickname', 'email', 'password', 'confirmPassword', 
      'firstName', 'lastName',
      'street', 'city', 'zip', 'state'  // ← Adressfelder auch required
    ];
    
    requiredFields.forEach((field) => {
      if (!formData[field] || !formData[field].toString().trim()) {
        errors[field] = 'Dieses Feld ist erforderlich.';
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Passwort muss mindestens 6 Zeichen lang sein.';
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwörter stimmen nicht überein.';
    }

    // ZIP validation
    if (formData.zip && (formData.zip.length !== 5 || !/^\d+$/.test(formData.zip))) {
      errors.zip = 'PLZ muss genau 5 Ziffern haben.';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // 🔧 OPTION 3: Nur Top-Level-Felder, KEIN adress-Objekt
      const registrationData = {
        nickname: formData.nickname,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        adress: {
          street: formData.street,
          city: formData.city,
          district: formData.district || "",  // Optional
          zip: parseInt(formData.zip, 10),
          state: formData.state
        }
      };

      console.log('🔍 Sending complete registration data:', registrationData);

      const result = await register(registrationData);
      
      if (result.success) {
        setMessage('✅ Registrierung erfolgreich! Sie werden weitergeleitet...');
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        setTimeout(() => {
          navigate('/profile', { replace: true });
        }, 1500);
      } else {
        setMessage(`❌ ${result.message || 'Registrierung fehlgeschlagen'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('❌ Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldLabels = {
    nickname: 'Spitzname *',
    email: 'E-Mail *',
    password: 'Passwort *',
    confirmPassword: 'Passwort bestätigen *',
    firstName: 'Vorname *',
    lastName: 'Nachname *',
    street: 'Straße *',           // ← Jetzt required
    city: 'Stadt *',              // ← Jetzt required
    district: 'Landkreis oder Stadtteil',
    zip: 'PLZ *',                 // ← Jetzt required
    state: 'Bundesland *',        // ← Jetzt required
  };

  const getFieldIcon = (field) => {
    switch (field) {
      case 'email': return <Mail size={16} />;
      case 'password':
      case 'confirmPassword': return <Lock size={16} />;
      case 'nickname': return <User size={16} />;
      case 'street':
      case 'city':
      case 'district':
      case 'zip':
      case 'state': return <MapPin size={16} />;
      default: return <User size={16} />;
    }
  };

  return (
    <div className="register-form-container">
      <div className="logo-background">
        <img src={logo} alt="Hand in Hand Logo" className="animated-logo" />
      </div>

      <form onSubmit={handleSubmit} className="register-form" noValidate>
        <div className="form-header">
          <h2>Registrierung</h2>
          <p>Werden Sie Teil unserer Nachbarschaftsgemeinschaft</p>
        </div>

        <div className="form-grid">
          {Object.keys(fieldLabels).map((field) => (
            <div key={field} className="form-group">
              <label className="register-label">
                {fieldLabels[field]}:
                <div className="input-container">
                  <span className="input-icon">
                    {getFieldIcon(field)}
                  </span>
                  <input
                    type={
                      field === 'email' ? 'email' :
                      (field === 'password' || field === 'confirmPassword') ? 
                        (field === 'password' ? (showPassword ? 'text' : 'password') : 
                         (showConfirmPassword ? 'text' : 'password')) :
                      field === 'zip' ? 'text' : 'text'
                    }
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={[
                      'nickname', 'email', 'password', 'confirmPassword', 
                      'firstName', 'lastName', 'street', 'city', 'zip', 'state'
                    ].includes(field)}  // ← Erweiterte Liste
                    className={`register-input ${
                      touchedFields[field] ? 'touched' : ''
                    } ${formErrors[field] ? 'error' : ''}`}
                    placeholder={`${fieldLabels[field]} eingeben`}
                    autoComplete={
                      field === 'email' ? 'email' :
                      field === 'password' ? 'new-password' :
                      field === 'confirmPassword' ? 'new-password' :
                      'off'
                    }
                  />
                  {(field === 'password' || field === 'confirmPassword') && (
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => field === 'password' ? 
                        setShowPassword(!showPassword) : 
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        (field === 'password' ? showPassword : showConfirmPassword) ? 
                        'Passwort verbergen' : 'Passwort anzeigen'
                      }
                    >
                      {(field === 'password' ? showPassword : showConfirmPassword) ? 
                        <EyeOff size={16} /> : <Eye size={16} />
                      }
                    </button>
                  )}
                </div>
                {formErrors[field] && (
                  <p className="register-error">{formErrors[field]}</p>
                )}
              </label>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`register-button ${isSubmitting ? 'loading' : ''}`}
        >
          {isSubmitting ? (
            <>
              <Loader size={20} className="spinner" />
              Registrierung läuft...
            </>
          ) : (
            <>
              <CheckCircle size={20} />
              Registrieren
            </>
          )}
        </button>

        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="form-footer">
          <p>
            Bereits registriert? 
            <Link to="/login" className="login-link">
              Hier anmelden
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
