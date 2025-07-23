import React, { useContext, useState, useEffect } from "react";
import "./Exchange.css";
import { AuthContext } from "../../context/AuthContext";

export default function Hilfe() {
  const { currentUser } = useContext(AuthContext);
  const [hilfeItems, setHilfeItems] = useState([]);

  useEffect(() => {
    // Hier später API-Request für Hilfethemen
    // Aktuell Dummy-Daten
    setHilfeItems([
      { _id: "1", title: "Dummy-Hilfe", description: "Hier könnten Hilfethemen stehen." }
    ]);
  }, []);

  return (
    <div className="exchange-page hilfe">
      <h2 className="exchange-title">Hilfe</h2>
      <div className="exchange-list">
        {hilfeItems.map((item) => (
          <div className="exchange-card hilfe-card full-width-card" key={item._id}>
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