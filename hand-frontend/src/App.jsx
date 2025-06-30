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
import Exchange from './pages/Exchange/Exchange.jsx';
import Blog from './pages/Blog';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';

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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/home" element={<LandingPage />} /> 
            <Route path="/exchange/*" element={<Exchange />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/events" element={<Events />} />
            
           <Route path="/events/:id" element={<EventDetail />} />
            
            <Route path="*" element={<div>Seite nicht gefunden</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

