import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function VerifyEmail() {
  const [status, setStatus] = useState('Verifiziere...');
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      let token = params.token;
      if (!token) {
        setError('Kein Verifizierungstoken gefunden');
        return;
      }
      try {
        const response = await fetch(`http://localhost:4000/api/auth/verify/${token}`);
        const data = await response.json();
        if (response.ok && data.success) {
          setStatus('E-Mail erfolgreich verifiziert!');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError(data.message || 'Verifizierung fehlgeschlagen');
        }
      } catch (err) {
        setError('Fehler bei der Verifizierung');
      }
    };
    verifyEmail();
  }, [navigate, params.token]);

  return (
    <div>
      {error ? <div style={{ color: 'red' }}>{error}</div> : <div>{status}</div>}
    </div>
  );
}

export default VerifyEmail;