// import React, { useContext, useState, useEffect } from "react";
// import axios from "axios";
// import "./Exchange.css";
// import { AuthContext } from "../../context/AuthContext";

// export default function Tauschen() {
//   const { user } = useContext(AuthContext);
//   const [tauschenItems, setTauschenItems] = useState([]);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
//         const res = await axios.get(`${API_URL}/exchange?category=tauschen`);
//         if (res.data.success) {
//           setTauschenItems(res.data.data);
//         } else {
//           console.error("Fehler beim Laden:", res.data.message);
//         }
//       } catch (error) {
//         console.error("Fehler beim Abrufen:", error);
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
//     const tauschGegen = form.tauschGegen.value;
//     const image = form.image.value;
//     try {
//       const token = user?.token || localStorage.getItem("token");
//       const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
//       const payload = {
//         title,
//         description,
//         category: "tauschen",
//         tauschGegen,
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
//         setTauschenItems((prev) => [data.data, ...prev]);
//       } else {
//         alert("Fehler: " + (data.message || "Unbekannter Fehler"));
//       }
//     } catch (error) {
//       alert("Fehler beim Senden: " + (error.response?.data?.message || error.message));
//     }
//   };

//   console.log(user);

//   return (
//     <div className="exchange-page tauschen">
//       <h2 className="exchange-title">Tauschen in deiner Nähe</h2>

//       <div className="exchange-list">
//         {tauschenItems.map((item, index) => (
//           <div
//             className={`exchange-card tauschen-card full-width-card ${
//               index % 2 === 0 ? "left" : "right"
//             }`}
//             key={item._id}
//           >
//             {item.image && <img src={item.image} alt={item.title} />}
//             <div className="card-body">
//               <h3>{item.title}</h3>
//               <p>{item.description}</p>
//               <p>
//                 <strong>Tausche gegen:</strong> {item.tauschGegen || "Keine Angabe"}
//               </p>
//               {item.author?.nickname && (
//                 <p>
//                   <strong>Anbieter:</strong> {item.author.nickname}
//                 </p>
//               )}
//               {user && (
//                 <button className="contact-button" onClick={() => handleContact(item._id)}>
//                   Kontakt aufnehmen
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {user && (
//         <div className="submission-form">
//           <h3>Neues Tausch-Angebot einstellen</h3>
//           <form onSubmit={handleSubmit}>
//             <input type="text" name="title" placeholder="Titel" required />
//             <textarea name="description" placeholder="Beschreibung" required />
//             <input type="text" name="tauschGegen" placeholder="Wunschtausch" required />
//             <input type="url" name="image" placeholder="Bild-URL (optional)" />
//             <button type="submit">Angebot erstellen</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useContext, useState, useEffect } from "react";
import "./Exchange.css";
import { AuthContext } from "../../context/AuthContext";

export default function Tauschen() {
  const { currentUser } = useContext(AuthContext);
  const [tauschenItems, setTauschenItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/exchange?category=tauschen");
        const data = await res.json();
        if (data.success) {
          setTauschenItems(data.data);
        } else {
          console.error("Fehler beim Laden:", data.message);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen:", error);
      }
    };

    fetchItems();
  }, []);

  const handleContact = (itemId) => {
    console.log("Kontaktaufnahme zu Item:", itemId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const res = await fetch("http://localhost:4000/api/exchange", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser?.token || ""}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Angebot erfolgreich erstellt!");
        e.target.reset();
        setTauschenItems((prev) => [data.data, ...prev]);
      } else {
        alert("❌ Fehler: " + data.message);
      }
    } catch (err) {
      console.error("Fehler beim Senden:", err);
      alert("❌ Fehler beim Erstellen des Angebots");
    }
  };

  return (
    <div className="exchange-page tauschen">
      <h2 className="exchange-title">Tauschen in deiner Nähe</h2>

      <div className="exchange-list">
        {tauschenItems.map((item, index) => (
          <div
            className={`exchange-card tauschen-card full-width-card ${
              index % 2 === 0 ? "left" : "right"
            }`}
            key={item._id}
          >
            {item.picture && <img src={`http://localhost:4000/uploads/${item.picture}`} alt={item.title} />}
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
              {currentUser && (
                <button className="contact-button" onClick={() => handleContact(item._id)}>
                  Kontakt aufnehmen
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {currentUser && (
        <div className="submission-form">
          <h3>Neues Tausch-Angebot einstellen</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Titel" required />
            <textarea name="description" placeholder="Beschreibung" required />
            <input type="text" name="tauschGegen" placeholder="Wunschtausch" required />
            <input type="file" name="picture" accept="image/*" />
            <button type="submit">Angebot erstellen</button>
          </form>
        </div>
      )}
    </div>
  );
}
