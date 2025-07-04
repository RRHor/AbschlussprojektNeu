
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut } from 'lucide-react';
import './Navbar.css';
import logo from '../assets/logo.png';


function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img className="logo" src={logo} alt="Hand in Hand" />
          <span className="logo-text">Hand in Hand</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-right-group">
          {/* Auth Links */}
          <ul className="direct-nav-menu">
            {user ? (
              <li className="nav-item">

                <span className="nav-user">
                  <User size={18} />
                  {user.name}
                </span>
              </li>
            ) : (
              <li className="nav-item">
                <Link 
                  to="/login" 
                  className={`nav-links nav-links-primary ${isActive('/login') ? 'active' : ''}`}
                >
                  Login
                </Link>

              </li>
            )}
          </ul>

          {/* Burger Menu */}
          <div className="burger-menu-container">
            <button 
              className="burger-icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu */}
            <ul className={`burger-nav-menu ${isMenuOpen ? 'active' : ''}`}>
              <li className="nav-item">

                <Link 
                  to="/" 
                  className={`nav-links ${isActive('/') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/exchange" 
                  className={`nav-links ${isActive('/exchange') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Verschenken & Tauschen
                </Link>

              </li>
              <li className="nav-item">
                <Link 
                  to="/events" 
                  className={`nav-links ${isActive('/events') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Events
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/blog" 
                  className={`nav-links ${isActive('/blog') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/help" 
                  className={`nav-links ${isActive('/help') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hilfe
                </Link>
              </li>
              
              {user ? (
                <>
                  <li className="nav-item">
                    <Link 
                      to="/profile" 
                      className={`nav-links ${isActive('/profile') ? 'active' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profil
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="nav-links logout-btn"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link 
                    to="/register" 
                    className={`nav-links ${isActive('/register') ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrieren
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
