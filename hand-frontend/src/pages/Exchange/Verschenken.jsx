import React, { useState, useEffect } from "react";
import "./Exchange.css";
import { useAuth } from '../../context/AuthContext';

export default function Verschenken() {
  const { user } = useAuth();
  const [verschenkenItems, setVerschenkenItems] = useState([]);

  // Angebote vom Backend laden
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/exchange?category=verschenken");
        const data = await res.json();
        if (data.success) {
          setVerschenkenItems(data.data);
        } else {
          console.error("Fehler beim Laden:", data.message);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Verschenk-Daten:", error);
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
    const imageFile = formData.get("picture");
    let pictureBase64 = "";
    if (imageFile && imageFile.size > 0) {
      pictureBase64 = await toBase64(imageFile);
    }
    const payload = {
      title,
      description,
      category: "verschenken",
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
        alert("Beitrag erfolgreich erstellt!");
        e.target.reset();
        setVerschenkenItems((prev) => [data.data, ...prev]);
      } else {
        alert("Fehler: " + data.message);
      }
    } catch (err) {
      console.error("Fehler beim Senden:", err);
      alert("Fehler beim Erstellen des Beitrags");
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
    <div className="exchange-page verschenken">
      <h2 className="exchange-title">Verschenken in deiner Nähe</h2>
      <div className="exchange-list">
        {verschenkenItems.map((item, index) => (
          <div
            className={`exchange-card full-width-card ${index % 2 === 0 ? "left" : "right"}`}
            key={item._id}
          >
            {item.picture && (
              <img src={item.picture} alt={item.title} />
            )}
            <div className="card-body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
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
          <h3>Etwas Neues einstellen</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Titel" required />
            <textarea name="description" placeholder="Beschreibung" required />
            <input type="file" name="picture" accept="image/*" />
            <button type="submit">Beitrag erstellen</button>
          </form>
        </div>
      )}
    </div>
  );
}