
import { useState, useContext, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Users, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api.js';

import logo from '../assets/logo.png'; 
import './EventDetail.css';

import { useNavigate } from 'react-router-dom';

const EventDetail = () => {

  const { id } = useParams();
  const { state } = useLocation();
  const [event, setEvent] = useState(state?.event || null);
  const { user } = useAuth();

  // 🔍 DEBUG: Event-Objekt komplett ausgeben
  console.log('🔍 LOCATION STATE:', state);
  console.log('🔍 EVENT OBJECT:', event);
  console.log('🔍 EVENT._id:', event?._id);
  console.log('🔍 EVENT.id:', event?.id);
  console.log('🔍 EVENT keys:', event ? Object.keys(event) : 'No event');


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
    if (event && event._id && user) {
      checkParticipationStatus();
    }
  }, [event, user]);


  useEffect(() => {

    if (event?._id) {
      api.get(`/event-comments/event/${event._id}`)
        .then(res => setComments(res.data))
        .catch(err => console.error('Fehler beim Laden der Kommentare:', err));
    }
  }, [event]);

  // Event aus Backend laden, falls nicht im State
  useEffect(() => {
    if (!event && id) {
      api.get(`/events/${id}`)
        .then(res => setEvent(res.data))
        .catch(() => setEvent(null));
    }
  }, [id, event]);

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
}, [event, id]);

// Handlers
const handleSubmit = (e) => {
  e.preventDefault();
  if (!text.trim()) return;

  const newComment = {
    id: Date.now(),
    user: {
      name: user?.name || 'Unbekannt',
      avatar: user?.avatar || logo,
    },
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

 setComments(prev => [newComment, ...prev]);
  setText('');
};

function handleLike(id) {
  setComments(prev =>
    prev.map(comment =>
      comment.id === id
        ? { ...comment, liked: !comment.liked }
        : comment
    )
  );
}
const handleEmoji = (id, emoji) => {
  setComments(prev =>
    prev.map(comment =>
      comment.id === id
        ? { ...comment, text: comment.text + ' ' + emoji }
        : comment
    )
  );
  setActiveEmojiPicker(null); // Hide emoji picker after selecting an emoji
};


const handleReply = (name) => {
  setText(prev => `@${name} ` + prev);
};

function handleEdit(id) {
  const newText = prompt('Bearbeite deinen Kommentar:');
  if (newText && newText.trim()) {
    setComments(prev =>
      prev.map(comment =>
        comment.id === id
          ? { ...comment, text: newText }
          : comment
      )
    );
  }
}

  // Bestehende Funktionen bleiben gleich...
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!event || !event._id) {
      alert("Event nicht geladen!");
      return;
    }

    // Debug-Ausgabe:
    console.log("event:", event);
    console.log("event._id:", event?._id);

    try {
      const res = await api.post('/event-comments', {
        text,
        event: event._id   // <-- Das muss mitgesendet werden!
      });
      setComments([res.data, ...comments]);
      setText('');
    } catch (err) {
      alert('Fehler beim Absenden des Kommentars');
      console.error(err);
    }
  };


  function handleDelete(id) {
    setComments(comments.filter((c) => c.id !== id));
  }

const goBack = () => {
  window.history.back();
};


if (!event) return <p>Event nicht gefunden.</p>;
if (loading) return <p>Benutzerdaten werden geladen...</p>;


return (
  <div className="event-detail-wrapper">


      {/* Zurück Button */}

  if (!event) {
    return <div>Lade Event...</div>;
  }

  return (
    <div className="event-detail-wrapper">

      <button onClick={goBack} className="back-button">
        <ArrowLeft size={20} className="back-button-icon" />
        Zurück
      </button>

      {/* Event Info */}
      <div className="event-detail-container">
        <div className="events-image">
          <img src={event.image} alt={event.title} />
        </div>
        <div className="event-info">
          <h1>{event.title}</h1>
          <p><strong>📅 Datum:</strong> {event.date}</p>
          <p><strong>📍 Ort:</strong> {event.location}</p>
          <p className="event-description">{event.description}</p>
          <button
  className="register-button"
  onClick={() => navigate(`/events/${event.id}/register`, { state: { event } })}
>
  Ich will teilnehmen!
</button>
        </div>
      </div>


      {/* Kommentare */}

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
            {/* Show first letter of user's name or logo if not available */}
            {user?.name ? (
              <div className="comment-avatar-circle">
                {user.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <img
                src={logo}
                alt="avatar"
                className="comment-avatar-img"
              />
            )}
            <div className="comment-form-fields">
              <div className="comment-user-name">{user?.name}</div>
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
                  {/* Show first letter of commenter's name or logo if not available */}
                  {c.user.name ? (
                    <div className="comment-avatar-circle">
                      {c.user.name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <img
                      src={logo}
                      alt="avatar"
                      className="comment-avatar-img"
                    />
                  )}
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
                    <div style={{ position: 'relative' }}>
  <button onClick={() => setActiveEmojiPicker(c.id)} title="Emoji">😊</button>

  {activeEmojiPicker === c.id && (
    <div className="emoji-picker">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          className="emoji-btn"
          onClick={() => handleEmoji(c.id, emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  )}
</div>

                    <button onClick={() => handleReply(c.user.name)} title="Antworten">Antworten</button>
                    <button onClick={() => handleEdit(c.id)} title="Bearbeiten">Bearbeiten</button>
                    {c.user.name === user?.name && (
                      <button onClick={() => handleDelete(c.id)} title="Kommentar löschen">🗑</button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="event-bottom-inspire">
        <p className="inspire-quote">„Gemeinsam gestalten wir unsere Nachbarschaft – sei dabei!“</p>
        <a href="/" className="logo-link">
          <img src={logo} alt="Logo" className="logo-image" />
        </a>
        <p className="inspire-text">„all Rechte vorbehalten bei Hand in Hand e.V.“</p>
      </div>
    </div>
  );
};

export default EventDetail;