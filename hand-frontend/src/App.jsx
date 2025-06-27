// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Falls du AuthContext hast
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Help from './pages/Help'; 
import Exchange from './pages/Exchange/Exchange.jsx';
import ForgotPassword from './components/ForgotPassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<LandingPage />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/help" element={<Help />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/exchange/*" element={<Exchange />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* 404 Route */}
            <Route path="*" element={<div>Seite nicht gefunden</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;