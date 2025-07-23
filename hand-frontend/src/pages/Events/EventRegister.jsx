import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './EventRegister.css';
import { ArrowLeft } from 'lucide-react';


const EventRegister = () => {
  const { id } = useParams(); // ID az URL
  const location = useLocation(); // ta event ro az route state begirim
  const navigate = useNavigate();

  const event = location.state?.event; // age az EventDetail bemoferesti
  const [form, setForm] = useState({ name: '', email: '', comment: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Chon backend nadari, axios ro comment mikonim:
      // await axios.post(`/events/${id}/register`, form);

      console.log("Fake registration:", { eventId: id, ...form });

      setSuccess('Du hast dich erfolgreich angemeldet! 🎉');
      setForm({ name: '', email: '', comment: '' });
    } catch (err) {
      setError('Es gab ein Problem bei der Anmeldung.');
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return <p style={{ padding: '2rem' }}>Event nicht gefunden oder direkt aufgerufen. Bitte über die Eventseite öffnen.</p>;
  }

return (

    
    
        <div className="event-register-container">
            <button onClick={() => navigate(-1)} className="back-button">
                <ArrowLeft size={20} className="back-button-icon" />
                Zurück
            </button>

{/*Bild*/}
      <div className="image-wrapper">
        <img src={event.image} alt="Event" className="event-image-horizontal" />
      </div>

        <div className="event-register-header">
            <h1 className="event-register-title">Anmeldung für: {event.title}</h1>
            <p style={{ fontStyle: 'italic' }}>{event.date} – {event.location}</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
            <input
                name="name"
                placeholder="Dein Name"
                value={form.name}
                onChange={handleChange}
                required
            />
            <input
                name="email"
                type="email"
                placeholder="Deine E-Mail"
                value={form.email}
                onChange={handleChange}
                required
            />
            <textarea
                name="comment"
                placeholder="Kommentar (optional)"
                value={form.comment}
                onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
                {loading ? 'Wird gesendet...' : 'Anmelden'}
            </button>
        </form>

        {success && <p className="success-msg">{success}</p>}
        {error && <p className="error-msg">{error}</p>}
    </div>
    
);
};



export default EventRegister;
