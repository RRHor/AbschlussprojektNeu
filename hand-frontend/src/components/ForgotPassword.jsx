import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [step, setStep] = useState('email'); // 'email', 'verification', 'reset', 'success'
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'E-Mail-Adresse ist erforderlich';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('verification');
    }, 2000);
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.verificationCode) {
      newErrors.verificationCode = 'Bestätigungscode ist erforderlich';
    } else if (formData.verificationCode.length !== 6) {
      newErrors.verificationCode = 'Der Code muss 6 Zeichen lang sein';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('reset');
    }, 1500);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'Neues Passwort ist erforderlich';
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = 'Passwort muss mindestens 8 Zeichen lang sein';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwort bestätigen ist erforderlich';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 2000);
  };

  const resendCode = () => {
    setIsLoading(true);
    // Simulate resend API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const goBackToLogin = () => {
    window.location.href = '/login';
  };

  const renderEmailStep = () => (
    <div className="forgot-password-form">
      <div className="form-header">
        <h2>Passwort vergessen?</h2>
        <p>Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Bestätigungscode.</p>
      </div>
      
      <form onSubmit={handleEmailSubmit}>
        <div className="input-group">
          <label>E-Mail-Adresse</label>
          <div className="input-container">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="max.mustermann@email.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Code senden...
            </>
          ) : (
            'Code senden'
          )}
        </button>
      </form>

      <div className="form-footer">
        <button onClick={goBackToLogin} className="link-button">
          Zurück zur Anmeldung
        </button>
      </div>
    </div>
  );

  const renderVerificationStep = () => (
    <div className="forgot-password-form">
      <div className="form-header">
        <h2>Code eingeben</h2>
        <p>Wir haben einen 6-stelligen Bestätigungscode an <strong>{formData.email}</strong> gesendet.</p>
      </div>
      
      <form onSubmit={handleVerificationSubmit}>
        <div className="input-group">
          <label>Bestätigungscode</label>
          <div className="input-container">
            <input
              type="text"
              value={formData.verificationCode}
              onChange={(e) => handleInputChange('verificationCode', e.target.value)}
              placeholder="000000"
              maxLength="6"
              className={errors.verificationCode ? 'error' : ''}
            />
            {errors.verificationCode && <span className="error-message">{errors.verificationCode}</span>}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Überprüfen...
            </>
          ) : (
            'Code bestätigen'
          )}
        </button>
      </form>

      <div className="form-footer">
        <p>Code nicht erhalten?</p>
        <button onClick={resendCode} className="link-button" disabled={isLoading}>
          Code erneut senden
        </button>
      </div>
    </div>
  );

  const renderResetStep = () => (
    <div className="forgot-password-form">
      <div className="form-header">
        <h2>Neues Passwort erstellen</h2>
        <p>Erstellen Sie ein sicheres Passwort für Ihr Konto.</p>
      </div>
      
      <form onSubmit={handlePasswordReset}>
        <div className="input-group">
          <label>Neues Passwort</label>
          <div className="input-container">
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              placeholder="Mindestens 8 Zeichen"
              className={errors.newPassword ? 'error' : ''}
            />
            {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
          </div>
        </div>

        <div className="input-group">
          <label>Passwort bestätigen</label>
          <div className="input-container">
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Passwort wiederholen"
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Passwort ändern...
            </>
          ) : (
            'Passwort ändern'
          )}
        </button>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="forgot-password-form success">
      <div className="success-icon">✅</div>
      <div className="form-header">
        <h2>Passwort erfolgreich geändert!</h2>
        <p>Ihr Passwort wurde erfolgreich aktualisiert. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.</p>
      </div>

      <button onClick={goBackToLogin} className="btn btn-primary">
        Zur Anmeldung
      </button>
    </div>
  );

  const renderProgressBar = () => (
    <div className="progress-container">
      <div className="progress-bar">
        <div className={`progress-step ${step === 'email' ? 'active' : step !== 'email' ? 'completed' : ''}`}>
          <div className="step-circle">1</div>
          <span>E-Mail</span>
        </div>
        <div className={`progress-step ${step === 'verification' ? 'active' : ['reset', 'success'].includes(step) ? 'completed' : ''}`}>
          <div className="step-circle">2</div>
          <span>Bestätigung</span>
        </div>
        <div className={`progress-step ${step === 'reset' ? 'active' : step === 'success' ? 'completed' : ''}`}>
          <div className="step-circle">3</div>
          <span>Neues Passwort</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-wrapper">
        {step !== 'success' && renderProgressBar()}
        
        {step === 'email' && renderEmailStep()}
        {step === 'verification' && renderVerificationStep()}
        {step === 'reset' && renderResetStep()}
        {step === 'success' && renderSuccessStep()}
      </div>
    </div>
  );
};

export default ForgotPassword;