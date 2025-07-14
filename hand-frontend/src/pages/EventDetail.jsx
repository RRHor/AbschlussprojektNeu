import { useState, useContext,useEffect } from 'react';
import { useLocation,useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {AuthContext}  from '../context/AuthContext.jsx';
import axios from 'axios';
import logo from '../assets/logo.png'; 
import './EventDetail.css';

import { useNavigate } from 'react-router-dom';

const EventDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams(); // Get event ID from URL parameters
  const eventFromState = state?.event || null; // Get event data from state or null if not available
  const { user, loading } = useContext(AuthContext); // logged-in user from AuthContext

  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);
  const [event, setEvent] = useState(eventFromState); // State to hold event data
  const emojis = ['😊', '😂', '😍', '😢', '😡', '👍', '👏', '🙌', '🎉', '❤️'];
  const [activeEmojiPicker, setActiveEmojiPicker] = useState(null);

  useEffect(() => {
    if (!event) {
      // Fetch the event by ID if not passed via state
      axios.get(`/events/${id}`)
        .then((res) => {
          setEvent(res.data.data); // Adjust to your API response
        })
        .catch((err) => {
          console.error('Fehler beim Laden des Events:', err);
        });
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