
import React, { useEffect, useState } from "react";
import "./Events.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Events = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    axios.get(`${API_URL}/events`)
      .then(res => setEvents(res.data))
      .catch(() => setEvents([]));
  }, []);

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


                  navigate(`/events/${event._id}`, { state: { event } })

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
