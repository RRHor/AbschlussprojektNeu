// client/src/components/Navbar.jsx

import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo oder App-Name (ganz links) */}
        <a href="/" className="navbar-logo">
          NachbarschaftsApp
        </a>

        {/* Gruppe für die rechten Elemente: Register/Login und Burger-Menü */}
        <div className="nav-right-group">
          {/* Direkte Links: Register und Login (links in dieser Gruppe) */}
          <ul className="direct-nav-menu">
            <li className="nav-item">
              <a href="/register" className="nav-links nav-links-primary">
                Neu registrieren
              </a>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-links nav-links-primary">
                Login
              </a>
            </li>
          </ul>

          {/* Burger-Menü Container (rechts in dieser Gruppe) */}
          <div className="burger-menu-container">
            <div className="burger-icon">
              {/* Hier ist unser Burger-Icon - wir stylen es mit CSS */}
              ☰ {/* Unicode-Zeichen für das Burger-Icon */}
            </div>
            {/* Die versteckten Navigationslinks */}
            <ul className="burger-nav-menu">
              <li className="nav-item">
                <a href="/home" className="nav-links">
                  Biete
                </a>
              </li>
              <li className="nav-item">
                <a href="/events" className="nav-links">
                  Suche
                </a>
              </li>
              <li className="nav-item">
                <a href="/blog" className="nav-links">
                  Verschenke
                </a>
              </li>
              <li className="nav-item">
                <a href="/help" className="nav-links">
                  Hilfe
                </a>
              </li>
              <li className="nav-item">
                <a href="/profile" className="nav-links">
                  Events
                </a>
              </li>
              <li className="nav-item">
                <a href="/help" className="nav-links">
                  Blogs
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;