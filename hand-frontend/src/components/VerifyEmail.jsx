import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Hole die API-URL aus der .env Best Practice!
const apiUrl = import.meta.env.VITE_API_URL;

function VerifyEmail() {
  const [status, setStatus] = useState('Verifiziere...');
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      // Verifizierungscode und Email aus der URL lesen
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const email = params.get('email');
      if (!code || !email) {
        setError('Kein Verifizierungscode gefunden');
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/auth/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, email }),
        });
        const data = await response.json();
        if (response.ok) {
          setStatus('E-Mail erfolgreich verifiziert!');
          // Nach 3 Sekunden zur Login-Seite weiterleiten
          setTimeout(() => navigate('/login'), 3000);
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