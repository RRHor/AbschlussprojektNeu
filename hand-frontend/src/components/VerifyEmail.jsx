import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
function VerifyEmail() {
  const [status, setStatus] = useState('Verifiziere...');
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const verifyEmail = async () => {
      // Verifizierungscode aus der URL lesen
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      if (!code) {
        setError('Kein Verifizierungscode gefunden');
        return;
      }
      try {
        // Anfrage an das Backend senden
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });
        const data = await response.json();
        if (response.ok) {
          setStatus('E-Mail erfolgreich verifiziert!');
          // Nach 3 Sekunden zur Startseite weiterleiten
          setTimeout(() => navigate('/'), 3000);
        } else {
          setError(data.message || 'Verifizierung fehlgeschlagen');
        }
      } catch (err) {
        setError('Fehler bei der Verbindung zum Server');
        console.error('Verifizierungsfehler:', err);
      }
    };
    verifyEmail();
  }, [location.search, navigate]);
  return (
    <div className="verify-container">
      <h2>E-Mail-Verifizierung</h2>
      {error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Zurück zur Startseite</button>
        </div>
      ) : (
        <div className="success-message">
          <p>{status}</p>
          {status.includes('erfolgreich') && (
            <p>Du wirst zur Startseite weitergeleitet...</p>
          )}
        </div>
      )}
    </div>
  );
}
export default VerifyEmail;