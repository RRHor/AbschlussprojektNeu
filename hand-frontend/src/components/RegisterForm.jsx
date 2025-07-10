import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';
import logo from '../assets/logo.png';
import register from '../assets/animation/Animation - register.json';
import Lottie from 'lottie-react';
const RegisterForm = ({ onSuccess }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    district: '',
    zip: '',
  });

  // Speichert, ob Feld verlassen wurde UND Inhalt hat
  const [touchedFields, setTouchedFields] = useState({
    nickname: false,
    email: false,
    password: false,
    firstName: false,
    lastName: false,
    street: false,
    city: false,
    district: false,
    zip: false,
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const isFilled = value.trim() !== '';
    setTouchedFields((prev) => ({
      ...prev,
      [name]: isFilled,
    }));
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        errors[key] = 'Dieses Feld darf nicht leer sein.';
      }
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setFormErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: formData.nickname,
          email: formData.email,
          password: formData.password,
          adress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            street: formData.street,
            city: formData.city,
            district: formData.district,
            zip: parseInt(formData.zip, 10),
          },
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        onSuccess(data);
        navigate('/login');
      } else {
        setMessage(`❌ Fehler: ${data.message || 'Unbekannter Fehler'}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Serverfehler.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldLabels = {
    nickname: 'Spitzname',
    email: 'E-Mail',
    password: 'Passwort',
    firstName: 'Vorname',
    lastName: 'Nachname',
    street: 'Straße',
    city: 'Stadt',
    district: 'Landkreis oder Stadtteil',
    zip: 'PLZ',
  };

  return (
    <div className="register-section">
      <div className="register-form-container">
        {/* Animation on the left */}
        <div className="animation-container">
          <Lottie animationData={register} loop={true} className="register-animation" />
        </div>
        {/* Form on the right */}
        <div className="form-card">

          {/* Header with logo and title - moved above the form */}
          <h2 className="register-title">Hand in Hand Registrieren</h2>
          <form onSubmit={handleSubmit} className="register-form-grid" noValidate>
            {/* Row 1 */}
            <div className="register-form-row">
              <label className="register-label">
                Spitzname:
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`register-input ${touchedFields.nickname ? 'filled' : ''}`}
                />
                {formErrors.nickname && <p className="register-warning">{formErrors.nickname}</p>}
              </label>

              <label className="register-label">
                E-Mail:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`register-input ${touchedFields.email ? 'filled' : ''}`}
                />
                {formErrors.email && <p className="register-warning">{formErrors.email}</p>}
              </label>

              <label className="register-label">
                Passwort:
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`register-input ${touchedFields.password ? 'filled' : ''}`}
                />
                {formErrors.password && <p className="register-warning">{formErrors.password}</p>}
              </label>
            </div>
            {/* Row 2 */}
            <div className="register-form-row">
              <label className="register-label">
                Vorname:
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`register-input ${touchedFields.firstName ? 'filled' : ''}`}
                />
                {formErrors.firstName && <p className="register-warning">{formErrors.firstName}</p>}
              </label>

              <label className="register-label">
                Nachname:
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`register-input ${touchedFields.lastName ? 'filled' : ''}`}
                />
                {formErrors.lastName && <p className="register-warning">{formErrors.lastName}</p>}
              </label>

              <label className="register-label">
                Straße:
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`register-input ${touchedFields.street ? 'filled' : ''}`}
                />
                {formErrors.street && <p className="register-warning">{formErrors.street}</p>}
              </label>
            </div>
            {/* Row 3 */}
            <div className="register-form-row">
              <label className="register-label">
                Stadt:
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`register-input ${touchedFields.city ? 'filled' : ''}`}
                />
                {formErrors.city && <p className="register-warning">{formErrors.city}</p>}
              </label>

              <label className="register-label">
                Landkreis/Stadtteil:
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`register-input ${touchedFields.district ? 'filled' : ''}`}
                />
                {formErrors.district && <p className="register-warning">{formErrors.district}</p>}
              </label>

              <label className="register-label">
                PLZ:
                <input
                  type="number"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`register-input ${touchedFields.zip ? 'filled' : ''}`}
                />
                {formErrors.zip && <p className="register-warning">{formErrors.zip}</p>}
              </label>
            </div>
            {/* Submit Button */}
            <div className="register-button-container">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`register-button ${isSubmitting ? 'disabled' : ''}`}
              >
                {isSubmitting ? 'Wird gesendet…' : 'Registrieren'}
              </button>
            </div>

            {message && <p className="register-warning">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
