// import React, { useContext, useState, useEffect } from "react";
// import axios from "axios";
// import "./Exchange.css";
// import buecherkisteImg from "../../assets/fotos/bücherkiste.jpeg";
// import kinderspielzeugImg from "../../assets/fotos/kinderspielzeug.jpeg";
// import { AuthContext } from "../../context/AuthContext"; // Zugriff auf login info

// const verschenkenItems = [
//   {
//     id: 1,
//     title: "Kinderspielzeug",
//     description: "Gut erhalten, für 2–4 Jahre.",
//     image: kinderspielzeugImg,
//   },
//   {
//     id: 2,
//     title: "Bücherpaket",
//     description: "Romane, Krimis und Klassiker.",
//     image: buecherkisteImg,
//   },
// ];

// export default function Verschenken() {
//   const { user } = useContext(AuthContext);
//   const [exchangeItems, setExchangeItems] = useState([]);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
//         const res = await axios.get(`${API_URL}/exchange?category=verschenken`);
//         if (res.data.success) {
//           setExchangeItems(res.data.data);
//         } else {
//           console.error("Fehler beim Laden der Verschenken-Beiträge:", res.data.message);
//         }
//       } catch (err) {
//         console.error("Fehler beim Abrufen der Verschenken-Beiträge:", err);
//       }
//     };
//     fetchItems();
//   }, []);

//   const handleContact = (itemId) => {
//     console.log("Kontaktaufnahme zu Item:", itemId);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const form = e.target;
//     const title = form.title.value;
//     const description = form.description.value;
//     const image = form.image.value;
//     try {
//       const token = user?.token || localStorage.getItem("token");
//       const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
//       const payload = {
//         title,
//         description,
//         category: "verschenken",
//         image,
//       };
//       const res = await axios.post(
//         `${API_URL}/exchange`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const data = res.data;
//       if (data.success) {
//         alert("✅ Angebot erfolgreich erstellt!");
//         e.target.reset();
//         setExchangeItems((prev) => [data.data, ...prev]);
//       } else {
//         alert("Fehler: " + (data.message || "Unbekannter Fehler"));
//       }
//     } catch (error) {
//       alert("Fehler beim Senden: " + (error.response?.data?.message || error.message));
//     }
//   };

//   return (
//     <div className="exchange-page verschenken">
//       <h2 className="exchange-title">Verschenken in deiner Nähe</h2>

//       <div className="exchange-list">
//         {/* Statische Beispiel-Beiträge */}
//         {verschenkenItems.map((item, index) => (
//           <div
//             className={`exchange-card full-width-card ${index % 2 === 0 ? "left" : "right"}`}
//             key={item.id}
//           >
//             <img src={item.image} alt={item.title} />
//             <div className="card-body">
//               <h3>{item.title}</h3>
//               <p>{item.description}</p>
//               {user && (
//                 <button
//                   className="contact-button"
//                   onClick={() => handleContact(item.id)}
//                 >
//                   Kontakt aufnehmen
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//         {/* Dynamisch geladene Beiträge aus der Datenbank */}
//         {exchangeItems.map((item, index) => (
//           <div
//             className={`exchange-card full-width-card ${index % 2 === 0 ? "left" : "right"}`}
//             key={item._id}
//           >
//             {item.image && (
//               <img src={item.image} alt={item.title} />
//             )}
//             <div className="card-body">
//               <h3>{item.title}</h3>
//               <p>{item.description}</p>
//               {user && (
//                 <button
//                   className="contact-button"
//                   onClick={() => handleContact(item._id)}
//                 >
//                   Kontakt aufnehmen
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="submission-form">
//         <h3>Etwas Neues einstellen</h3>
//         <form onSubmit={handleSubmit}>
//           <input type="text" name="title" placeholder="Titel" required />
//           <textarea name="description" placeholder="Beschreibung" required />
//           <input type="url" name="image" placeholder="Bild-URL (optional)" />
//           <button type="submit">Beitrag erstellen</button>
//         </form>
//       </div>
//     </div>
//   );
// }


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
        const res = await fetch("http://localhost:4000/api/exchange?category=verschenken");
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
      const res = await fetch("http://localhost:4000/api/exchange", {
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
