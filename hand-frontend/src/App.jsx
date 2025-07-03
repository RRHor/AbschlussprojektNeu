// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Help from './pages/Help'; 
import ForgotPassword from './components/ForgotPassword';
import VerifyEmail from './components/VerifyEmail';
import Exchange from './pages/Exchange/Exchange.jsx';
import Blog from './pages/Blog';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            {/* Hauptseiten */}
            <Route path="/" element={<LandingPage />} /> 
            <Route path="/home" element={<Home />} />
            
            {/* Authentifizierung */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* E-Mail Verifizierung */}
            <Route path="/verify/:token" element={<VerifyEmail />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            
            {/* User-Bereich */}
            <Route path="/profile" element={<Profile />} />
            
            {/* Features */}
            <Route path="/exchange/*" element={<Exchange />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            
            {/* Hilfe */}
            <Route path="/help" element={<Help />} />
            
            {/* Fallback */}
            <Route path="*" element={<div>Seite nicht gefunden</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

