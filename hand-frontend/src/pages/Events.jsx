import React from "react";
import "./Events.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const events = [
  {
    id: 0,
    title: "🌞 Sommerfest 2025",
    date: "22. August 2025",
    location: "Stadtpark",
    description:
      "Ein buntes Sommerfest für Groß und Klein mit Musik, Essen und Spielen.",
    image:
      "https://www.hfmt-hamburg.de/fileadmin/_processed_/myhfmtdb/f/e/csm_3850_2024-07-06-sommerfest_21ee662004.jpg",
  },
  {
    id: 1,
    title: "⚽ Fußballturnier",
    date: "20.September 2025",
    location: "Sportplatz Nord",
    description:
      "Freizeit-Teams aus dem Viertel treten gegeneinander an – für Spaß und Fairplay!",
    image:
      "https://www.adria-dream.de/files/Adria/Trainingslager/Fussball/Turniere/Fu%C3%9Fballspieler%20Jugend%20kind-fu%C3%9Fballer-schuss-verwendung-613201%20bottomlayercz0%20pixabay.com%20Lizenz%20Public%20Domain%20CC0_1920x1280.jpg",
  },
  {
    id: 2,
    title: "🛍️ Stadtbummel & Flohmarkt",
    date: "3. September 2025",
    location: "Altstadt",
    description:
      "Stöbern, schnuppern und entdecken – ein gemütlicher Sonntag in der Stadt.",
    image:
      "https://www.langschläfer-flohmarkt.de/s/cc_images/teaserbox_37858877.jpeg?t=1456511341",
  },
  {
    id: 3,
    title: "🎨 Kunst- und Handwerkermarkt",
    date: "30. August 2025",
    location: "Kunsthalle",
    description:
      "Lokale Künstler und Handwerker präsentieren ihre Werke – ein Fest für die Sinne!",
    image:
      "https://sparringa-veranstaltungen.de/wp-content/uploads/2018/06/KHW-14.4.16-9.jpg",
  },
  {
    id: 4,
    title: "🎶 Open-Air-Konzert",
    date: "14. August 2025",
    location: "Stadion",
    description:
      "Genieße Live-Musik unter freiem Himmel – ein unvergesslicher Abend!",
    image:
      "https://images.t-online.de/2025/05/axEXvCvhFbcB/0x124:4000x2250/fit-in/995x0/menschen-auf-ms-dockville-in-hamburg-wilhelmsburg-heben-die-haende-in-die-hoehe-archivbild-auch-in-diesem-sommer-finden-in-der-hansestadt-unzaehlige-open-air-events-statt.jpg",
  },
  {
    id: 5,
    title: "👵 Seniorentag",
    date: "2. Oktober 2025",
    location: "Seniorenzentrum",
    description:
      "Ein Tag voller Aktivitäten und Unterhaltung für unsere älteren Mitbürger.",
    image:
      "https://www.der-reporter.de/i/fileadmin/user_upload/import/artikel/80/3280/203280_AdobeStock_483016272_onlineZuschnitt.jpeg?_=1696025063&w=966&a=1.5&f=cover",
  },
];

const Events = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="events-container">
      <div className="blog-header">
        <h1>Nachbarschafts-Events</h1>
        <p>
          Entdecke, was in deiner Nachbarschaft passiert – von Sommerfesten bis
          Sportevents!
        </p>
      </div>

      <div className="event-cards">
        {events.map((event, index) => (
          <div className="event-card" key={index}>
            <img src={event.image} alt={event.title} />
            <div className="event-content">
              <h2>{event.title}</h2>
              <p className="event-date">
                {event.date} – {event.location}
              </p>
              <p>{event.description}</p>
              <button
                className="event-button"
                onClick={() =>
                  navigate(`/events/${index}`, { state: { event } })
                }
              >
                Ich mache mit!
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Footer */}
    </div>
  );
};

export default Events;
