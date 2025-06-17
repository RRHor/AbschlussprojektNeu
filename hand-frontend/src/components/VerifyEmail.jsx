import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const [message, setMessage] = useState("Bitte warten...");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get("email");
    const code = params.get("code");

    if (!email || !code) {
      setMessage("Fehlende Parameter in der URL!");
      return;
    }

    fetch("http://localhost:4000/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setMessage(data.message);
          if (data.success) {
            // Nach 3 Sekunden zur Startseite weiterleiten
            setTimeout(() => navigate('/'), 3000);
          }
        } else {
          setMessage("Verifizierung erfolgreich!");
        }
      })
      .catch(() => setMessage("Fehler bei der Verifizierung."));
  }, [location.search, navigate]);

  return (
    <div style={{ margin: "2rem", textAlign: "center" }}>
      <h2>E-Mail Verifizierung</h2>
      <p>{message}</p>
    </div>
  );
}