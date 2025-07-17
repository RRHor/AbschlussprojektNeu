


import React, { useContext, useState, useEffect } from "react";
import "./Exchange.css";
import { AuthContext } from "../../context/AuthContext";

export default function Verschenken() {

  const { currentUser } = useContext(AuthContext);
  console.log("👤 currentUser:", currentUser);
  const [verschenkenItems, setVerschenkenItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/exchange?category=verschenken");
        const data = await res.json();
        if (data.success) {
          setVerschenkenItems(data.data);
        } else {
          console.error("❌ Fehler beim Laden:", data.message);
        }
      } catch (error) {
        console.error("❌ Fehler beim Abrufen:", error);
      }
    };

    fetchItems();
  }, []);

  const handleContact = (itemId) => {
    console.log("📞 Kontaktaufnahme zu Item:", itemId);
    // Hier später API-Logik
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const title = formData.get("title");
    const description = formData.get("description");
    const imageFile = formData.get("picture");

    const payload = new FormData();
    payload.append("title", title);
    payload.append("description", description);
    payload.append("category", "verschenken");
    payload.append("picture", imageFile);

    try {
      const res = await fetch("http://localhost:5000/api/exchange", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser?.token || ""}`,
        },
        body: payload,
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Beitrag erfolgreich erstellt!");
        e.target.reset();
        setVerschenkenItems((prev) => [data.data, ...prev]);
      } else {
        alert("❌ Fehler: " + data.message);
      }
    } catch (err) {
      console.error("❌ Fehler beim Senden:", err);
      alert("❌ Fehler beim Erstellen");
    }
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
            key={item._id}
          >
            {item.picture && (
              <img src={item.picture} alt={item.title} />
            )}
            <div className="card-body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {item.author?.nickname && (
                <p><strong>Anbieter:</strong> {item.author.nickname}</p>
              )}
              {currentUser && (
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

      {currentUser && (
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
