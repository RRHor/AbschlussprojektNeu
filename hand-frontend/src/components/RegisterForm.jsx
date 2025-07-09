import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';
import logo from '../assets/logo.png';

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
    <>
      <div className="logo-background">
        <img src={logo} alt="Logo" className="animated-logo" />
      </div>

      <form onSubmit={handleSubmit} className="register-form" noValidate>
        {Object.keys(fieldLabels).map((field) => (
          <label key={field} className="register-label">
            {fieldLabels[field]}:
            <input
              type={
                field === 'email'
                  ? 'email'
                  : field === 'password'
                  ? 'password'
                  : field === 'zip'
                  ? 'number'
                  : 'text'
              }
              name={field}
              value={formData[field]}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`register-input ${
                touchedFields[field] ? 'filled' : ''
              }`}
              // placeholder={fieldLabels[field]}
              autoComplete="off"
            />
            {formErrors[field] && (
              <p className="register-warning">{formErrors[field]}</p>
            )}
          </label>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`register-button ${isSubmitting ? 'disabled' : ''}`}
        >
          {isSubmitting ? 'Wird gesendet…' : 'Registrieren'}
        </button>

        {message && <p className="register-warning">{message}</p>}
      </form>
    </>
  );
};

export default RegisterForm;
