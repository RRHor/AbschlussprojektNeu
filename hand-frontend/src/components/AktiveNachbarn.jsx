import React, { useEffect, useState, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import axios from "axios";
import "./AktiveNachbarn.css";

// Fallback-Daten für den Fall, dass das Backend nicht erreichbar ist
const fallbackNachbarn = [
  { name: "Erika Adler", status: "online" },
  { name: "Hans Müller", status: "online" },
  { name: "Petra Schmidt", status: "away" },
  { name: "Lukas Becker", status: "online" },
  { name: "Mila Fischer", status: "away" },
  { name: "Jonas Weber", status: "online" },
  { name: "Sophie Hoffmann", status: "away" },
  { name: "Maximilian Braun", status: "online" },
  { name: "Lea Zimmermann", status: "away" },
  { name: "Tim Richter", status: "online" },
  { name: "Anna Klein", status: "away" },
  { name: "Paul Schmitt", status: "online" },
  { name: "Laura Wagner", status: "away" },
  { name: "Felix Schwarz", status: "online" },
  { name: "Nina Koch", status: "away" },
  { name: "Tobias Lang", status: "online" },
  { name: "Julia Weiß", status: "away" },
  { name: "David Hartmann", status: "online" },
  { name: "Sarah König", status: "away" },
];

function AktiveNachbarn() {
  const [nachbarn, setNachbarn] = useState(fallbackNachbarn);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nodeRef = useRef(null);

  // Aktive Nachbarn vom Backend holen
  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/users/active');
        
        if (response.data && response.data.length > 0) {
          setNachbarn(response.data);
          setError(null);
        } else {
          // Wenn keine Daten vom Backend, verwende Fallback-Daten
          setNachbarn(fallbackNachbarn);
        }
      } catch (error) {
        console.warn('Konnte aktive Nutzer nicht vom Backend laden:', error.message);
        setError(error.message);
        // Verwende Fallback-Daten bei Fehlern
        setNachbarn(fallbackNachbarn);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveUsers();
    
    // Aktualisiere die Liste alle 5 Minuten
    const interval = setInterval(fetchActiveUsers, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Zyklisches Durchlaufen der Nachbarn
  useEffect(() => {
    if (nachbarn.length === 0) return;
    
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % nachbarn.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [nachbarn.length]);

  if (loading) {
    return (
      <aside className="notification-nachbarn">
        <h3>👥 Aktive Nachbarn</h3>
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <p>Laden...</p>
        </div>
      </aside>
    );
  }

  const person = nachbarn[index] || { name: "Keine Nachbarn", status: "away" };

  return (
    <aside className="notification-nachbarn">
      <h3>👥 Aktive Nachbarn</h3>
      {error && (
        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
          (Offline-Modus)
        </div>
      )}
      <TransitionGroup component={null}>
        <CSSTransition
          key={person.name}
          timeout={800}
          classNames="slide-fade"
          nodeRef={nodeRef}
        >
          <div ref={nodeRef}>
            <ul className="nachbarn-list">
              <li>
                {person.name}
                <span className={`status ${person.status}`}></span>
              </li>
            </ul>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </aside>
  );
}

export default AktiveNachbarn;