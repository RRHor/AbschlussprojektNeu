// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Help from './pages/Help'; 
import Exchange from './pages/Exchange/Exchange.jsx'; // oder wo auch immer die Datei ist


function App() {
  return (
    <Router>
      <Navbar /> {/* Die Navbar wird immer angezeigt, unabhängig von der Route */}
      <div className="container"> {/* Optional: Ein Container für deinen Seiteninhalt */}
        <Routes>
          <Route path="/" element={<LandingPage/>} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/help" element={<Help/>} />
          <Route path="/events" />
          <Route path="/profile" element={<Profile />} />
          <Route path="/exchange/*" element={<Exchange />} /> {/* exchange beinhaltet: Verschenke, Tauschen, Suchen */}

        </Routes>
      </div>
    </Router>
  );
}

export default App;