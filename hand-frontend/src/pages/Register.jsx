import React from 'react';
import RegisterForm from '../components/RegisterForm.jsx';

const Register = ({ onSuccess }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // ... Registrierung ...
      
      if (response.success) {
        // Timestamp für "neue User" Erkennung setzen
        localStorage.setItem('registrationTime', Date.now().toString());
        
        // Zur Verifizierungs-Info weiterleiten
        navigate('/verify-info');
      }
    } catch (error) {
      // ... error handling
    }
  };

  return (
    <div className="register-page">
      <RegisterForm onSuccess={onSuccess} />
    </div>
  );
};

export default Register;