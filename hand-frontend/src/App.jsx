// client/src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Help from './pages/Help'; 
import Blog from './pages/Blog';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Exchange from './pages/Exchange/Exchange'; 
import ForgotPassword from './components/ForgotPassword';
import Home from './pages/Home';

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<LandingPage/>} /> 
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/help" element={<Help/>} />
          <Route path="/events" element={<Events />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/exchange/*" element={<Exchange />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="*" element={<div>Seite nicht gefunden</div>} />


        </Routes>
      </div>
    </>
  );
}

export default App;

