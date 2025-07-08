import React, { useContext } from "react";
import "./Exchange.css";
import buecherkisteImg from "../../assets/fotos/bücherkiste.jpeg";
import kinderspielzeugImg from "../../assets/fotos/kinderspielzeug.jpeg";
import { AuthContext } from "./AuthContext"; // Zugriff auf login info

const verschenkenItems = [
  {
    id: 1,
    title: "Kinderspielzeug",
    description: "Gut erhalten, für 2–4 Jahre.",
    image: kinderspielzeugImg,
  },
  {
    id: 2,
    title: "Bücherpaket",
    description: "Romane, Krimis und Klassiker.",
    image: buecherkisteImg,
  },
];

export default function Verschenken() {
  const { currentUser } = useContext(AuthContext);

  const handleContact = (itemId) => {
    console.log("Kontaktaufnahme zu Item:", itemId);
    // später fetch() oder API-Aufruf hier
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Neuer Beitrag erstellt");
    // hier später Upload oder API-Post einbauen
  };

  return (
    <div className="exchange-page verschenken">
      <h2 className="exchange-title">Verschenken in deiner Nähe</h2>

      <div className="exchange-list">
        {verschenkenItems.map((item, index) => (
          <div
            className={`exchange-card full-width-card ${
              index % 2 === 0 ? "left" : "right"
            }`}
            key={item.id}
          >
            <img src={item.image} alt={item.title} />
            <div className="card-body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {currentUser && (
      <button
        className="contact-button"
        onClick={() => handleContact(item.id)}
      >
        Kontakt aufnehmen
      </button>
    )}
            </div>
          </div>
        ))}
      </div>

      <div className="submission-form">
        <h3>Etwas Neues einstellen</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Titel" required />
          <textarea placeholder="Beschreibung" required />
          <input type="file" accept="image/*" />
          <button type="submit">Beitrag erstellen</button>
        </form>
      </div>
    </div>
  );
}
