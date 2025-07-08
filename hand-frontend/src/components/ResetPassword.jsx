import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import './ResetPassword.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async () => {
    setError('');
    if (!token) {
      setError('Ungültiger oder fehlender Reset-Token');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }
    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, {
        newPassword: password,
        confirmPassword: confirmPassword
      });
      // Axios: Antwortdaten sind unter res.data
      if (res.data && res.data.success) {
        setSuccess(true);
      } else {
        setError(res.data?.message || 'Fehler beim Zurücksetzen des Passworts');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Fehler beim Zurücksetzen des Passworts. Token möglicherweise ungültig oder abgelaufen.');
    } finally {
      setIsLoading(false);
    }
  };
  if (success) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="success-content">
            <CheckCircle className="success-icon" />
            <h2 className="success-title">
              Passwort erfolgreich zurückgesetzt!
            </h2>
            <p className="success-text">
              Du kannst dich jetzt mit deinem neuen Passwort anmelden.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="success-button"
            >
              Zur Anmeldung
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="header">
          <Lock className="header-icon" />
          <h2 className="header-title">
            Neues Passwort erstellen
          </h2>
          <p className="header-subtitle">
            Gib dein neues Passwort ein
          </p>
        </div>
        <div className="form-container">
          <div className="form-fields">
            <div className="field-group">
              <label htmlFor="password" className="field-label">
                Neues Passwort
              </label>
              <div className="field-input-container">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field-input"
                  placeholder="Mindestens 8 Zeichen"
                />
                <button
                  type="button"
                  className="field-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="field-toggle-icon" />
                  ) : (
                    <Eye className="field-toggle-icon" />
                  )}
                </button>
              </div>
            </div>
            <div className="field-group">
              <label htmlFor="confirm-password" className="field-label">
                Passwort bestätigen
              </label>
              <div className="field-input-container">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="field-input"
                  placeholder="Passwort wiederholen"
                />
                <button
                  type="button"
                  className="field-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="field-toggle-icon" />
                  ) : (
                    <Eye className="field-toggle-icon" />
                  )}
                </button>
              </div>
            </div>
          </div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div className="submit-container">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !token}
              className="submit-button"
            >
              {isLoading ? 'Wird zurückgesetzt...' : 'Passwort zurücksetzen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}