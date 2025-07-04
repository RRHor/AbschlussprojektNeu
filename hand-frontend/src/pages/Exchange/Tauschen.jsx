import React, { useContext, useState, useEffect } from "react";
import "./Exchange.css";
import { useAuth } from '../../context/AuthContext';

export default function Tauschen() {
  const { user } = useAuth();
  const [tauschenItems, setTauschenItems] = useState([]);

  // Angebote vom Backend laden
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/exchange?category=tauschen");
        const data = await res.json();
        if (data.success) {
          setTauschenItems(data.data);
        } else {
          console.error("Fehler beim Laden:", data.message);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Tauschdaten:", error);
      }
    };
    fetchItems();
  }, []);

  const handleContact = (itemId) => {
    alert("Kontaktaufnahme zu Item: " + itemId);
  };

  // Neues Angebot senden
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const description = formData.get("description");
    const tauschGegen = formData.get("tauschGegen");
    const imageFile = formData.get("picture");
    let pictureBase64 = "";
    if (imageFile && imageFile.size > 0) {
      pictureBase64 = await toBase64(imageFile);
    }
    const payload = {
      title,
      description,
      category: "tauschen",
      tauschGegen,
      picture: pictureBase64,
    };
    try {
      const res = await fetch("/api/exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token || ""}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert("Angebot erfolgreich erstellt!");
        e.target.reset();
        setTauschenItems((prev) => [data.data, ...prev]);
      } else {
        alert("Fehler: " + data.message);
      }
    } catch (err) {
      console.error("Fehler beim Senden:", err);
      alert("Fehler beim Erstellen des Angebots");
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  return (
    <div className="exchange-page tauschen">
      <h2 className="exchange-title">Tauschen in deiner Nähe</h2>
      <div className="exchange-list">
        {tauschenItems.map((item, index) => (
          <div
            className={`exchange-card tauschen-card full-width-card ${index % 2 === 0 ? "left" : "right"}`}
            key={item._id}
          >
            {item.picture && (
              <img src={item.picture} alt={item.title} />
            )}
            <div className="card-body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>
                <strong>Tausche gegen:</strong> {item.tauschGegen || "Keine Angabe"}
              </p>
              {item.author?.nickname && (
                <p>
                  <strong>Anbieter:</strong> {item.author.nickname}
                </p>
              )}
              {user && (
                <button
                  className="contact-button"
                  onClick={() => handleContact(item._id)}
                >
                  Kontakt aufnehmen
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {user && (
        <div className="submission-form">
          <h3>Neues Tausch-Angebot einstellen</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Titel" required />
            <textarea name="description" placeholder="Beschreibung" required />
            <input
              type="text"
              name="tauschGegen"
              placeholder="Wunschtausch (z.B. Hilfe oder Sache)"
              required
            />
            <input type="file" name="picture" accept="image/*" />
            <button type="submit">Angebot erstellen</button>
          </form>
        </div>
      )}
    </div>
  );
}