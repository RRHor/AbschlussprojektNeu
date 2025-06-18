// client/src/App.jsx

import React from 'react';
import Navbar from './components/Navbar'; // Importiere deine Navbar-Komponente
import './App.css'; // Oder dein globales CSS, falls vorhanden

function App() {
  return (
    <>
      <Navbar /> {/* Die Navbar wird hier ganz oben gerendert */}
      <main>
        {/* Hier werden später deine verschiedenen Seiten (pages/) oder Module (modules/) gerendert */}
        {/* Zum Beispiel mit React Router Dom: */}
        {/* <Routes> */}
        {/* <Route path="/" element={<HomePage />} /> */}
        {/* <Route path="/events" element={<EventsPage />} /> */}
        {/* ... */}
        {/* </Routes> */}
        <h1>Willkommen in deiner NachbarschaftsApp!</h1>
        <p>Dies ist der Hauptbereich deiner Anwendung.</p>
      </main>
    </>
  );
}

export default App;