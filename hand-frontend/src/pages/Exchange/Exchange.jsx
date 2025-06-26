import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Gift, RefreshCw, Search } from 'lucide-react';
import Verschenken from './Verschenken.jsx';
import Tauschen from './Tauschen.jsx';
import Suchen from './Suchen.jsx';
import './Exchange.css';

const Exchange = () => {
  // Navigation items for maintainability
  const navItems = [
    {
      path: 'verschenken',
      label: 'Verschenken',
      icon: <Gift size={20} />,
      description: 'Gegenstände verschenken'
    },
    {
      path: 'tauschen',
      label: 'Tauschen',
      icon: <RefreshCw size={20} />,
      description: 'Gegenstände tauschen'
    },
    {
      path: 'suchen',
      label: 'Suchen',
      icon: <Search size={20} />,
      description: 'Nach Gegenständen suchen'
    }
  ];

  return (
    <div className="exchange-page">
      {/* Header */}
      <header className="exchange-header">
        <h1>🎁 Verschenken & Tauschen</h1>
        <p>Gib Dingen ein zweites Leben und finde, was du brauchst</p>
      </header>

      {/* Navigation */}
      <nav className="exchange-nav" role="navigation" aria-label="Exchange Navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `exchange-nav-link ${isActive ? 'active' : ''}`
            }
            aria-label={item.description}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Content */}
      <main className="exchange-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="exchange-welcome">
                <div className="welcome-content">
                  <h2>Willkommen beim Tausch & Verschenk-Markt!</h2>
                  <p>Wähle eine Kategorie aus dem Menü oben, um zu beginnen.</p>
                  
                  <div className="category-cards">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className="category-card"
                      >
                        <div className="card-icon">{item.icon}</div>
                        <h3>{item.label}</h3>
                        <p>{item.description}</p>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            } 
          />
          <Route path="verschenken" element={<Verschenken />} />
          <Route path="tauschen" element={<Tauschen />} />
          <Route path="suchen" element={<Suchen />} />
          {/* Redirect invalid paths */}
          <Route path="*" element={<Navigate to="/exchange" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Exchange;
