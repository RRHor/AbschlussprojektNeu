import React, { useEffect, useState, useRef } from 'react'; // ← useRef hinzufügen
import { useParams, useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';  // ← ENTFERNT
import './VerifyEmail.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const hasVerified = useRef(false); // ← NEU: useRef statt useState

  useEffect(() => {
    if (token && !hasVerified.current) { // ← Prüfe hasVerified
      hasVerified.current = true; // ← Setze sofort auf true
      verifyEmail();
    } else if (!token) {
      setStatus('error');
      setMessage('Kein Verifizierungstoken gefunden');
    }
  }, [token]);

  // Countdown für automatische Weiterleitung
  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      redirectUser();
    }
  }, [status, countdown]);

  const verifyEmail = async () => {
    try {
      console.log('🔄 Starte Verifizierung...');
      
      const response = await fetch(`http://localhost:4000/api/auth/verify/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('📥 Verifizierung Response:', data);

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setUserInfo(data);
      } else {
        setStatus('error');
        setMessage(data.message || 'Verifizierung fehlgeschlagen');
      }
    } catch (error) {
      console.error('❌ Verifizierungsfehler:', error);
      setStatus('error');
      setMessage('Ein Netzwerkfehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    }
  };

  const redirectUser = () => {
    // Immer zur Login-Seite nach erfolgreicher Verifizierung
    navigate('/login', { 
      state: { 
        message: 'E-Mail erfolgreich verifiziert! Bitte loggen Sie sich ein.',
        verified: true,
        email: userInfo?.user?.email,
        isNewUser: userInfo?.isNewUser
      }
    });
  };

  const handleManualRedirect = () => {
    setCountdown(0);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '3rem', 
        borderRadius: '1rem',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        
        {status === 'verifying' && (
          <div>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              margin: '0 auto 2rem',
              border: '4px solid #98fb98',
              borderTop: '4px solid #ff6b6b',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <h2>E-Mail wird verifiziert...</h2>
            <p>Bitte warten Sie einen Moment.</p>
          </div>
        )}

        {status === 'success' && userInfo && (
          <div>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2>Verifizierung erfolgreich!</h2>
            <p style={{ marginBottom: '2rem' }}>{message}</p>
            
            <div style={{ 
              background: '#f5f5dc', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              marginBottom: '2rem',
              borderLeft: '4px solid #98fb98'
            }}>
              <p>
                Sie werden in <strong style={{ color: '#ff6b6b' }}>{countdown}</strong> Sekunden 
                zur Anmeldung weitergeleitet.
              </p>
            </div>

            <button 
              onClick={handleManualRedirect}
              style={{
                background: '#ff6b6b',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              🔐 Jetzt anmelden
            </button>

            <div style={{ 
              background: '#98fb98', 
              padding: '1.5rem', 
              borderRadius: '0.5rem',
              color: 'white',
              marginTop: '2rem'
            }}>
              <p>👋 Hallo <strong>{userInfo.user?.nickname || userInfo.user?.username}!</strong></p>
              <p style={{ fontStyle: 'italic', marginTop: '0.5rem' }}>
                Ihre E-Mail-Adresse wurde erfolgreich verifiziert!
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
            <h2>Verifizierung fehlgeschlagen</h2>
            <p style={{ color: '#dc3545', marginBottom: '2rem' }}>{message}</p>
            
            <div>
              <Link 
                to="/login"
                style={{
                  background: '#ff6b6b',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  marginRight: '1rem'
                }}
              >
                🔐 Zur Anmeldung
              </Link>
              <Link 
                to="/register"
                style={{
                  background: '#2c5f6f',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  textDecoration: 'none',
                  borderRadius: '0.5rem'
                }}
              >
                📝 Neu registrieren
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;