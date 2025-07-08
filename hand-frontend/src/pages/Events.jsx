// import React, { useState, useEffect } from 'react';
// import './Events.css'; 
// import { ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api.js';

// const Events = () => {
//   const navigate = useNavigate();
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Events beim Laden der Komponente abrufen
//   useEffect(() => {
//     loadEvents();
//   }, []);

//   const loadEvents = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await api.get('/events');
//       console.log('📥 Events geladen:', response.data);
      
//       // Flexibel - verschiedene Backend-Antwort-Formate
//       const eventsData = response.data.events || response.data || [];
//       setEvents(eventsData);
//     } catch (error) {
//       console.error('Fehler beim Laden der Events:', error);
//       setError('Fehler beim Laden der Events');
      
//       // Fallback: Lade statische Events wenn Backend nicht verfügbar
//       const fallbackEvents = [
//         {
//           _id: 'static-1',
//           title: "🌞 Sommerfest 2025",
//           date: "22. August 2025",
//           location: "Stadtpark",
//           description: "Ein buntes Sommerfest für Groß und Klein mit Musik, Essen und Spielen.",
//           image: "https://www.hfmt-hamburg.de/fileadmin/_processed_/myhfmtdb/f/e/csm_3850_2024-07-06-sommerfest_21ee662004.jpg"
//         },
//         {
//           _id: 'static-2',
//           title: "⚽ Fußballturnier",
//           date: "20.September 2025",
//           location: "Sportplatz Nord",
//           description: "Freizeit-Teams aus dem Viertel treten gegeneinander an – für Spaß und Fairplay!",
//           image: "https://www.adria-dream.de/files/Adria/Trainingslager/Fussball/Turniere/Fu%C3%9Fballspieler%20Jugend%20kind-fu%C3%9Fballer-schuss-verwendung-613201%20bottomlayercz0%20pixabay.com%20Lizenz%20Public%20Domain%20CC0_1920x1280.jpg"
//         }
//       ];
//       setEvents(fallbackEvents);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const goBack = () => {
//     navigate(-1);
//   };

//   const handleEventClick = (event) => {
//     console.log('🔍 Event clicked:', event);
//     navigate(`/events/${event._id}`, { state: { event } });
//   };

//   if (loading) {
//     return (
//       <div className="events-container">
//         <div style={{ textAlign: 'center', padding: '60px' }}>
//           <h2>Events werden geladen...</h2>
//           <div style={{ fontSize: '48px' }}>🔄</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="events-container">
//       <button onClick={goBack} className="back-button">
//         <ArrowLeft size={20} className="back-button-icon" />
//         Zurück
//       </button>

//       <h1 className="events-title">Nachbarschafts-Events</h1>
//       <p className="events-intro">
//         Entdecke, was in deiner Nachbarschaft passiert – von Sommerfesten bis Sportevents!
//       </p>

//       {error && (
//         <div style={{ 
//           backgroundColor: '#ffebee', 
//           color: '#c62828', 
//           padding: '10px', 
//           borderRadius: '5px', 
//           marginBottom: '20px' 
//         }}>
//           ⚠️ {error} (Fallback-Events werden angezeigt)
//         </div>
//       )}

//       <div className="event-cards">
//         {events.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '40px' }}>
//             <h3>Keine Events verfügbar</h3>
//             <p>Derzeit sind keine Events geplant.</p>
//           </div>
//         ) : (
//           events.map((event) => (
//             <div className="event-card" key={event._id}>
//               <img src={event.image} alt={event.title} />
//               <div className="event-content">
//                 <h2>{event.title}</h2>
//                 <p className="event-date">{event.date} – {event.location}</p>
//                 <p>{event.description}</p>
//                 <button
//                   className="event-button"
//                   onClick={() => handleEventClick(event)}
//                 >
//                   Ich mache mit!
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <footer className="events-footer">
//         <p>© 2025 Hand in Hand - Alle Rechte vorbehalten.</p>
//         <p>Kontakt | Impressum | Datenschutz</p>
//       </footer>
//     </div>  
//   );
// };

// export default Events;

import React, { useState, useEffect } from 'react';
import './Events.css'; 
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      console.log('📥 Loading events from API...');
      const response = await api.get('/events');
      console.log('📥 Events response:', response.data);
      
      const eventsData = response.data.events || response.data || [];
      setEvents(eventsData);
      setError(null);
    } catch (error) {
      console.error('❌ Error loading events:', error);
      setError('Backend nicht erreichbar');
      
      // Fallback: Statische Events mit MongoDB-ähnlichen IDs
      const fallbackEvents = [
        {
          _id: '507f1f77bcf86cd799439011',
          title: "🌞 Sommerfest 2025",
          date: "22. August 2025",
          location: "Stadtpark",
          description: "Ein buntes Sommerfest für Groß und Klein mit Musik, Essen und Spielen.",
          image: "https://www.hfmt-hamburg.de/fileadmin/_processed_/myhfmtdb/f/e/csm_3850_2024-07-06-sommerfest_21ee662004.jpg",
          isStatic: true
        },
        {
          _id: '507f1f77bcf86cd799439012',
          title: "⚽ Fußballturnier",
          date: "20. September 2025",
          location: "Sportplatz Nord",
          description: "Freizeit-Teams aus dem Viertel treten gegeneinander an!",
          image: "https://www.adria-dream.de/files/Adria/Trainingslager/Fussball/Turniere/Fu%C3%9Fballspieler%20Jugend%20kind-fu%C3%9Fballer-schuss-verwendung-613201%20bottomlayercz0%20pixabay.com%20Lizenz%20Public%20Domain%20CC0_1920x1280.jpg",
          isStatic: true
        }
      ];
      setEvents(fallbackEvents);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="events-container">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <h2>Events werden geladen...</h2>
          <div style={{ fontSize: '48px' }}>🔄</div>
        </div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <button onClick={goBack} className="back-button">
        <ArrowLeft size={20} className="back-button-icon" />
        Zurück
      </button>

      <h1 className="events-title">Nachbarschafts-Events</h1>
      <p className="events-intro">
        Entdecke, was in deiner Nachbarschaft passiert!
      </p>

      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '20px' 
        }}>
          ⚠️ {error} - Fallback-Events werden angezeigt
        </div>
      )}

      <div className="event-cards">
        {events.map((event) => (
          <div className="event-card" key={event._id}>
            <img src={event.image} alt={event.title} />
            <div className="event-content">
              <h2>{event.title}</h2>
              <p className="event-date">{event.date} – {event.location}</p>
              <p>{event.description}</p>
              <button
                className="event-button"
                onClick={() => {
                  console.log('🔍 Event selected:', event);
                  navigate(`/events/${event._id}`, { state: { event } });
                }}
              >
                Mehr erfahren
              </button>
            </div>
          </div>
        ))}
      </div>

      <footer className="events-footer">
        <p>© 2025 Hand in Hand - Alle Rechte vorbehalten.</p>
        <p>Kontakt | Impressum | Datenschutz</p>
      </footer>
    </div>  
  );
};

export default Events;