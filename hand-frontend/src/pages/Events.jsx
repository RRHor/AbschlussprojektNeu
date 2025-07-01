import React from 'react';
import './Events.css'; 
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';




const events = [
  {
    title: "🌞 Sommerfest 2025",
    date: "22. August 2025",
    location: "Stadtpark",
    description: "Ein buntes Sommerfest für Groß und Klein mit Musik, Essen und Spielen.",
    image: "https://www.hfmt-hamburg.de/fileadmin/_processed_/myhfmtdb/f/e/csm_3850_2024-07-06-sommerfest_21ee662004.jpg"
  },
  {
    title: "⚽ Fußballturnier",
    date: "20.September 2025",
    location: "Sportplatz Nord",
    description: "Freizeit-Teams aus dem Viertel treten gegeneinander an – für Spaß und Fairplay!",
    image: "https://www.adria-dream.de/files/Adria/Trainingslager/Fussball/Turniere/Fu%C3%9Fballspieler%20Jugend%20kind-fu%C3%9Fballer-schuss-verwendung-613201%20bottomlayercz0%20pixabay.com%20Lizenz%20Public%20Domain%20CC0_1920x1280.jpg"
  },
  {
    title: "🛍️ Stadtbummel & Flohmarkt",
    date: "27. Juli 2025",
    location: "Altstadt",
    description: "Stöbern, schnuppern und entdecken – ein gemütlicher Sonntag in der Stadt.",
    image: "https://www.langschläfer-flohmarkt.de/s/cc_images/teaserbox_37858877.jpeg?t=1456511341"
  },
  {
    title: "🎨 Kunst- und Handwerkermarkt",
    date: "3. August 2025",
    location: "Kunsthalle",
    description: "Lokale Künstler und Handwerker präsentieren ihre Werke – ein Fest für die Sinne!",
    image: "https://sparringa-veranstaltungen.de/wp-content/uploads/2018/06/KHW-14.4.16-9.jpg"
  },
  {
    title: "🎶 Open-Air-Konzert",
    date: "14. August 2025",
    location: "Stadion",
    description: "Genieße Live-Musik unter freiem Himmel – ein unvergesslicher Abend!",
    image: "https://images.t-online.de/2025/05/axEXvCvhFbcB/0x124:4000x2250/fit-in/995x0/menschen-auf-ms-dockville-in-hamburg-wilhelmsburg-heben-die-haende-in-die-hoehe-archivbild-auch-in-diesem-sommer-finden-in-der-hansestadt-unzaehlige-open-air-events-statt.jpg"
  },  
  {
    title: "👵 Seniorentag",
    date: "15. August 2025",
    location: "Seniorenzentrum",
    description: "Ein Tag voller Aktivitäten und Unterhaltung für unsere älteren Mitbürger.",
    image: "https://www.der-reporter.de/i/fileadmin/user_upload/import/artikel/80/3280/203280_AdobeStock_483016272_onlineZuschnitt.jpeg?_=1696025063&w=966&a=1.5&f=cover"
  },
];

const Events = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  

  return (
    <div className="events-container">
      <button onClick={goBack} className="back-button">
        <ArrowLeft size={20} className="back-button-icon" />
        Zurück
      </button>

      <h1 className="events-title">Nachbarschafts-Events</h1>
      <p className="events-intro">
        Entdecke, was in deiner Nachbarschaft passiert – von Sommerfesten bis Sportevents!
      </p>

      <div className="event-cards">
        {events.map((event, index) => (
          <div className="event-card" key={index}>
            <img src={event.image} alt={event.title} />
            <div className="event-content">
              <h2>{event.title}</h2>
              <p className="event-date">{event.date} – {event.location}</p>
              <p>{event.description}</p>
              <button
  className="event-button"
  onClick={() => navigate(`/events/${index}`, { state: { event } })}
>
  Ich mache mit!
</button>
            </div>

          </div>
        ))}
      </div>
     {/* Footer */}
      <footer className="events-footer">
        <p>© 2025 Hand in Hand - Alle Rechte vorbehalten.</p>
        <p>Kontakt | Impressum | Datenschutz</p>
      </footer>
    </div>  
    
  );
};

export default Events;

