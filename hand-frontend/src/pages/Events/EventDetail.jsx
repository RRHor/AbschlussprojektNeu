import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Users, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
import logo from '../../assets/logo.png'; 
import './EventDetail.css';
import { useNavigate } from 'react-router-dom';

const EventDetail = () => {

  const { id } = useParams();
  const { state } = useLocation();
  const [eventData, setEventData] = useState(state?.event || null);
  const { user } = useAuth();

  // 🔍 DEBUG: Event-Objekt komplett ausgeben
  console.log('🔍 LOCATION STATE:', state);
  console.log('🔍 EVENT OBJECT:', eventData);
  console.log('🔍 EVENT._id:', eventData?._id);
  console.log('🔍 EVENT.id:', eventData?.id);
  console.log('🔍 EVENT keys:', eventData ? Object.keys(eventData) : 'No event');


  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);
  const emojis = ['😊', '😂', '😍', '😢', '😡', '👍', '👏', '🙌', '🎉', '❤️'];
  const [activeEmojiPicker, setActiveEmojiPicker] = useState(null);

  
  // NEUE States für Teilnahme
  const [isParticipating, setIsParticipating] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [loading, setLoading] = useState(false);

  // Teilnahme-Status beim Laden prüfen
  useEffect(() => {
    if (eventData && eventData._id && user) {
      checkParticipationStatus();
    }
  }, [eventData, user]);


  useEffect(() => {
    if (eventData?._id) {
      axios.get(`${API_URL}/api/event-comments/event/${eventData._id}`)
        .then(res => setComments(res.data))
        .catch(err => console.error('Fehler beim Laden der Kommentare:', err));
    }
  }, [eventData]);

  // Event aus Backend laden, falls nicht im State
  useEffect(() => {
    if (!eventData && id) {
      axios.get(`${API_URL}/api/events/${id}`)
        .then(res => setEventData(res.data))
        .catch(() => setEventData(null));
    }
  }, [id, eventData]);

  // Teilnahme-Status prüfen
  const checkParticipationStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/events/${eventData._id}/my-participation`);
      setIsParticipating(response.data.isParticipating);
      setIsOrganizer(response.data.isOrganizer);
      setParticipantCount(response.data.participantCount);
    } catch (error) {
      console.error('Fehler beim Prüfen der Teilnahme:', error);
    }
  };



function handleLike(id) {
  setComments(prev =>
    prev.map(comment =>
      (comment._id ? comment._id : comment.id) === id
        ? { ...comment, liked: !comment.liked }
        : comment
    )
  );
}
const handleEmoji = (id, emoji) => {
  setComments(prev =>
    prev.map(comment =>
      (comment._id ? comment._id : comment.id) === id
        ? { ...comment, text: comment.text + ' ' + emoji }
        : comment
    )
  );
  setActiveEmojiPicker(null); // Hide emoji picker after selecting an emoji
};


const handleReply = (name) => {
  setText(prev => `@${name} ` + prev);
};


async function handleEdit(id) {
  const comment = comments.find(c => (c._id || c.id) === id);
  const oldText = comment?.text || '';
  const newText = prompt('Bearbeite deinen Kommentar:', oldText);
  if (newText && newText.trim() && newText !== oldText) {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/api/event-comments/${id}`, { text: newText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(prev => prev.map(comment =>
        (comment._id || comment.id) === id ? { ...comment, text: res.data.text } : comment
      ));
    } catch (err) {
      alert('Fehler beim Bearbeiten des Kommentars');
      console.error(err);
    }
  }
}

  // Bestehende Funktionen bleiben gleich...
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!eventData || !eventData._id) {
      alert("Event nicht geladen!");
      return;
    }

    // Debug-Ausgabe:
    console.log("eventData:", eventData);
    console.log("eventData._id:", eventData?._id);

    try {
      const res = await axios.post(`${API_URL}/api/event-comments`, {
        text,
        event: eventData._id   // <-- Das muss mitgesendet werden!
      });
      setComments([res.data, ...comments]);
      setText('');
    } catch (err) {
      alert('Fehler beim Absenden des Kommentars');
      console.error(err);
    }
  };



async function handleDelete(id) {
  if (!window.confirm('Kommentar wirklich löschen?')) return;
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/api/event-comments/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setComments(prev => prev.filter((c) => (c._id || c.id) !== id));
  } catch (err) {
    alert('Fehler beim Löschen des Kommentars');
    console.error(err);
  }
}

const goBack = () => {
  window.history.back();
};


if (!eventData) return <p>Event nicht gefunden.</p>;
if (loading) return <p>Benutzerdaten werden geladen...</p>;

return (
  <div className="event-detail-wrapper">
    <button onClick={goBack} className="back-button">
      <ArrowLeft size={20} className="back-button-icon" />
      Zurück
    </button>

    {/* Event Info */}
    <div className="event-detail-container">
      <div className="events-image">
        <img src={eventData.images && eventData.images[0]} alt={eventData.title} />
      </div>
      <div className="event-info">
        <h1>{eventData.title}</h1>
        <p><strong>📅 Datum:</strong> {new Date(eventData.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
        <p><strong>📍 Ort:</strong> {eventData.location}</p>
        <p className="event-description">{eventData.description}</p>
        <button
          className="register-button"
          onClick={async () => {
            try {
              const token = localStorage.getItem('token');
              await axios.post(`${API_URL}/api/events/${eventData._id}/join`, {}, {
                headers: { Authorization: `Bearer ${token}` }
              });
              checkParticipationStatus();
              alert('Du bist jetzt Teilnehmer!');
            } catch (error) {
              alert(error.response?.data?.message || 'Fehler bei der Anmeldung');
            }
          }}
          disabled={isParticipating}
        >
          {isParticipating ? 'Du bist bereits Teilnehmer' : 'Ich will teilnehmen!'}
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
            comments.map((c) => {
              const commentId = c._id ? c._id : c.id;
              return (
                <div key={commentId} className="comment-item">
                  <div className="comment-left">
                    {/* Show first letter of commenter's name or logo if not available */}
                    {c.user?.name ? (
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
                      <span className="comment-author">{c.user?.name || c.user?.nickname || c.user?.username || "Unbekannt"}</span>
                      <span className="comment-time">{c.time}</span>
                    </div>
                    <p className="comment-text-display">{c.text}</p>
                    <div className="comment-actions">
                      <button onClick={() => handleLike(commentId)} title="Gefällt mir" style={c.liked ? { color: '#e63946', fontSize: '1.25em' } : {}}>
                        {c.liked ? '❤️' : '👍'}
                      </button>
                      <div style={{ position: 'relative' }}>
                        <button onClick={() => setActiveEmojiPicker(commentId)} title="Emoji">😊</button>
                        {activeEmojiPicker === commentId && (
                          <div className="emoji-picker">
                            {emojis.map((emoji) => (
                              <button
                                key={emoji}
                                className="emoji-btn"
                                onClick={() => handleEmoji(commentId, emoji)}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button onClick={() => handleReply(c.user?.name)} title="Antworten">Antworten</button>
                      <button onClick={() => handleEdit(commentId)} title="Bearbeiten">Bearbeiten</button>
                      {c.user?.name === user?.name && (
                        <button onClick={() => handleDelete(commentId)} title="Kommentar löschen">🗑</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
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