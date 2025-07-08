// src/pages/Exchange/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

// Erstellt den Kontext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Zustand für eingeloggten Benutzer
  const [currentUser, setCurrentUser] = useState(null);

  // Hier könntest du später z. B. localStorage oder API-Login einbauen
  useEffect(() => {
    // Dummy-Daten für Demo-Zwecke
    const user = {
      id: 1,
      name: "Max Mustermann",
      email: "max@example.com",
    };

    // Setzt den User als eingeloggt
    setCurrentUser(user);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
