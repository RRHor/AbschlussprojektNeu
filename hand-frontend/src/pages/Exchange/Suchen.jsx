
import React, { useContext, useState, useEffect } from "react";
import "./Exchange.css";
import { AuthContext } from "../../context/AuthContext";

export default function Suchen() {
  const { currentUser } = useContext(AuthContext);
  const [suchItems, setSuchItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/exchange?category=suchen`);
        const data = await res.json();
        if (data.success) {
          setSuchItems(data.data);
        } else {
          console.error("Fehler beim Laden:", data.message);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen:", error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="exchange-page suchen">
      <h2 className="exchange-title">Suchen</h2>
      <div className="exchange-list">
        {suchItems.map((item) => (
          <div className="exchange-card suchen-card full-width-card" key={item._id}>
            <div className="card-body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// const Suchen = () => {
//   return (
//     <div className="exchange-page suchen">
//       <h2 className="exchange-title">Suchen</h2>
//       <div className="exchange-list">
//         {suchItems.map((item) => (
//           <div className="exchange-card suchen-card full-width-card" key={item._id}>
//             <div className="card-body">
//               <h3>{item.title}</h3>
//               <p>{item.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// import React, { useContext, useState, useEffect } from "react";
// import "./Exchange.css";
// import { AuthContext } from "../../context/AuthContext";

// export default function Suchen() {
//   const { currentUser } = useContext(AuthContext);
//   const [suchItems, setSuchItems] = useState([]);

//   useEffect(() => {
//     // Hier später API-Request für Suchergebnisse
//     // Aktuell Dummy-Daten
//     setSuchItems([
//       { _id: "1", title: "Dummy-Suche", description: "Hier könnten Suchergebnisse stehen." }
//     ]);
//   }, []);

//   )
// }
// // export default Suchen[nodemon] starting `node server.js`
// // passwordResetRequestRoute.js wurde geladen
// // 🔍 Environment Variables Status:
// // MONGO_URI exists: true
// // MONGO_URI value: Set
// // JWT_SECRET exists: true
// // PORT: 4000
// // 🚀 Server läuft auf http://localhost:4000
// // ✅ Mit MongoDB verbunden:
