import { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';  // ← Korrekt
import axios from 'axios';
import logo from '../assets/logo.png'; 
import './EventDetail.css';
import Footer from '../components/Footer';

const EventDetail = () => {
  const { state } = useLocation();
  const event = state?.event;
  const { user } = useAuth();  // ← Korrekt

  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);

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
          <button className="register-button">Ich will teilnehmen!</button>
        </div>
      </div>

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