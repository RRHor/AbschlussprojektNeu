import { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Users, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api.js';
import logo from '../assets/logo.png'; 
import './EventDetail.css';
import Footer from '../components/Footer';

const EventDetail = () => {
  const { state } = useLocation();
  const event = state?.event;
  const { user } = useAuth();

  // 🔍 DEBUG: Event-Objekt komplett ausgeben
  console.log('🔍 LOCATION STATE:', state);
  console.log('🔍 EVENT OBJECT:', event);
  console.log('🔍 EVENT._id:', event?._id);
  console.log('🔍 EVENT.id:', event?.id);
  console.log('🔍 EVENT keys:', event ? Object.keys(event) : 'No event');

  // Bestehende States
  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);
  
  // NEUE States für Teilnahme
  const [isParticipating, setIsParticipating] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [loading, setLoading] = useState(false);

  // Teilnahme-Status beim Laden prüfen
  useEffect(() => {
    if (event && user) {
      checkParticipationStatus();
    }
  }, [event, user]);

  // Teilnahme-Status prüfen
  const checkParticipationStatus = async () => {
    try {
      const response = await api.get(`/events/${event._id}/my-participation`);
      setIsParticipating(response.data.isParticipating);
      setIsOrganizer(response.data.isOrganizer);
      setParticipantCount(response.data.participantCount);
    } catch (error) {
      console.error('Fehler beim Prüfen der Teilnahme:', error);
    }
  };

  // Teilnahme anmelden/abmelden
  const handleParticipation = async () => {
    if (!user) {
      alert('Bitte melde dich an, um teilzunehmen!');
      return;
    }

    setLoading(true);
    try {
      if (isParticipating) {
        // Abmelden
        await api.delete(`/events/${event._id}/leave`);
        setIsParticipating(false);
        setParticipantCount(prev => prev - 1);
        alert('Teilnahme abgemeldet!');
      } else {
        // Anmelden
        await api.post(`/events/${event._id}/join`);
        setIsParticipating(true);
        setParticipantCount(prev => prev + 1);
        alert('Teilnahme erfolgreich angemeldet!');
      }
    } catch (error) {
      console.error('Fehler bei der Teilnahme:', error);
      alert('Fehler bei der Teilnahme. Versuche es nochmal.');
    } finally {
      setLoading(false);
    }
  };

  // Teilnehmer-Liste laden
  const loadParticipants = async () => {
    if (!user) {
      alert('Bitte melde dich an, um die Teilnehmer zu sehen!');
      return;
    }

    try {
      const response = await api.get(`/events/${event._id}/participants`);
      setParticipants(response.data.participants);
      setShowParticipants(true);
    } catch (error) {
      console.error('Fehler beim Laden der Teilnehmer:', error);
      alert('Fehler beim Laden der Teilnehmer.');
    }
  };

  // Button-Text bestimmen
  const getButtonText = () => {
    if (!user) return 'Anmelden um teilzunehmen';
    if (isOrganizer) return 'Du bist der Organisator';
    if (isParticipating) return 'Teilnahme abmelden';
    return 'Ich möchte teilnehmen!';
  };

  // Button-Klasse bestimmen
  const getButtonClass = () => {
    if (!user) return 'register-button disabled';
    if (isOrganizer) return 'register-button organizer';
    if (isParticipating) return 'register-button participating';
    return 'register-button';
  };

  // Bestehende Funktionen bleiben gleich...
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newComment = {
      id: Date.now(),
      user: {
        name: user?.nickname || user?.username || 'Unbekannt',  // ← Korrekte User-Properties
        avatar: user?.avatar || '/default-avatar.png',
      },
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setComments([newComment, ...comments]);
    setText('');
  };

  const handleDelete = (id) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  const goBack = () => {
    window.history.back();
  };

  if (!event) return <p>Event nicht gefunden.</p>;

  const handleLike = (id) => {
    setComments(prevComments =>
      prevComments.map(c =>
        c.id === id ? { ...c, liked: !c.liked } : c
      )
    );
  };

  return (
    <div className="event-detail-wrapper">
      <button onClick={goBack} className="back-button">
        <ArrowLeft size={20} className="back-button-icon" />
        Zurück
      </button>

      <div className="event-detail-container">
        <div className="events-image">
          <img src={event.image} alt={event.title} />
        </div>
        <div className="event-info">
          <h1>{event.title}</h1>
          <p><strong>📅 Datum:</strong> {event.date}</p>
          <p><strong>📍 Ort:</strong> {event.location}</p>
          <p className="event-description">{event.description}</p>
          
          {/* ERWEITERTE Button-Sektion */}
          <div className="participation-section">
            <button 
              className={getButtonClass()}
              onClick={handleParticipation}
              disabled={loading || isOrganizer || !user}
            >
              {loading ? (
                <>
                  <Loader size={16} className="spinner" />
                  Lädt...
                </>
              ) : (
                getButtonText()
              )}
            </button>
            
            {/* Teilnehmer-Anzeige */}
            {participantCount > 0 && (
              <div className="participants-info">
                <button 
                  className="participants-button"
                  onClick={loadParticipants}
                  disabled={!user}
                >
                  <Users size={16} />
                  {participantCount} Teilnehmer anzeigen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Teilnehmer-Liste Modal */}
      {showParticipants && (
        <div className="participants-modal">
          <div className="participants-modal-content">
            <div className="participants-header">
              <h3>Teilnehmer ({participants.length})</h3>
              <button 
                className="close-button"
                onClick={() => setShowParticipants(false)}
              >
                ✕
              </button>
            </div>
            <div className="participants-list">
              {participants.map(participant => (
                <div key={participant._id} className="participant-item">
                  <div className="participant-avatar">
                    {participant.nickname?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="participant-info">
                    <div className="participant-name">
                      {participant.nickname || participant.username}
                    </div>
                    {participant.firstName && participant.lastName && (
                      <div className="participant-full-name">
                        {participant.firstName} {participant.lastName}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="comment-section">
        <h2>Kommentare</h2>
        <form className="comment-form" onSubmit={handleSubmit}>
          <div className="comment-input-wrapper">
            <img
              src={user?.avatar || logo}
              alt="avatar"
              className="comment-avatar-img"
            />
            <div className="comment-form-fields">
              <div className="comment-user-name">{user?.nickname || user?.username || 'Unbekannt'}</div>
              <textarea
                className="comment-textarea"
                placeholder="Schreibe einen Kommentar..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="comment-submit-btn">Kommentieren</button>
        </form>

        <div className="comment-list">
          {comments.length === 0 ? (
            <p className="no-comments">Noch keine Kommentare.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="comment-item">
                <div className="comment-left">
                  <div className="comment-avatar-circle">
                    {c.user.name ? c.user.name.charAt(0).toUpperCase() : "?"}
                  </div>
                </div>
                <div className="comment-right">
                  <div className="comment-header">
                    <span className="comment-author">{c.user.name}</span>
                    <span className="comment-time">{c.time}</span>
                  </div>
                  <p className="comment-text-display">{c.text}</p>
                  <div className="comment-actions">
                    <button onClick={() => handleLike(c.id)} title="Gefällt mir">
                      {c.liked ? '💙' : '👍'}
                    </button>
                    <button title="Emoji">😊</button>
                    <button title="Antworten">Antworten</button>
                    {c.user.name === (user?.nickname || user?.username) && (
                      <button onClick={() => handleDelete(c.id)} title="Kommentar löschen">🗑</button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="event-bottom-inspire">
        <p className="inspire-quote">„Gemeinsam gestalten wir unsere Nachbarschaft – sei dabei!"</p>
        <a href="/" className="logo-link">
          <img src={logo} alt="Logo" className="logo-image" />
        </a>
        <p className="inspire-text">„Alle Rechte vorbehalten bei Hand in Hand e.V."</p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default EventDetail;