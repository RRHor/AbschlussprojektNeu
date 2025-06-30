import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import exchangeService from '../../services/exchangeService';
import ExchangeList from './ExchangeList';
import ExchangeCreate from './ExchangeCreate';
import ExchangeDetail from './ExchangeDetail';
import './Exchange.css';

const Exchange = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeCategory, setActiveCategory] = useState('alle');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Posts laden
  const fetchPosts = async (category = 'alle', search = '') => {
    setLoading(true);
    try {
      const filters = {};
      if (category !== 'alle') filters.category = category;
      if (search) filters.search = search;
      
      const result = await exchangeService.getAllPosts(filters);
      if (result.success) {
        setPosts(result.data);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(activeCategory, searchQuery);
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    navigate('/exchange');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    navigate('/exchange');
  };

  // Prüfen ob wir auf der Create-Seite sind
  const isOnCreatePage = location.pathname.includes('/exchange/create');

  return (
    <div className="exchange-container">
      {/* Header */}
      <div className="exchange-header">
        <h1>Exchange - Tauschen, Verschenken, Suchen</h1>
        <p>Teile mit deiner Nachbarschaft! Verschenke, tausche oder suche nach Gegenständen.</p>
      </div>

      {/* Navigation - nur anzeigen wenn NICHT auf Create-Seite */}
      {!isOnCreatePage && (
        <>
          <div className="exchange-nav">
            <div className="category-tabs">
              <button 
                className={`tab ${activeCategory === 'alle' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('alle')}
              >
                🏠 Alle
              </button>
              <button 
                className={`tab ${activeCategory === 'verschenken' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('verschenken')}
              >
                🎁 Verschenken
              </button>
              <button 
                className={`tab ${activeCategory === 'tauschen' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('tauschen')}
              >
                🔄 Tauschen
              </button>
              <button 
                className={`tab ${activeCategory === 'suchen' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('suchen')}
              >
                🔍 Suchen
              </button>
            </div>

            <div className="action-buttons">
              {user ? (
                <Link to="/exchange/create" className="btn btn-create">
                  ✏️ Anzeige erstellen
                </Link>
              ) : (
                <Link to="/login" className="btn btn-login">
                  Anmelden zum Erstellen
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar - auch nur auf der Hauptseite */}
          <div className="search-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Suche nach Gegenständen..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
              <button className="search-button">🔍</button>
            </div>
          </div>
        </>
      )}

      {/* Routes */}
      <Routes>
        <Route 
          path="/" 
          element={
            <ExchangeList 
              posts={posts}
              loading={loading}
              activeCategory={activeCategory}
              onRefresh={() => fetchPosts(activeCategory, searchQuery)}
            />
          } 
        />
        <Route 
          path="/create" 
          element={
            user ? (
              <ExchangeCreate onPostCreated={handlePostCreated} />
            ) : (
              <div className="auth-required">
                <h2>Anmeldung erforderlich</h2>
                <p>Um eine Anzeige zu erstellen, müssen Sie sich zuerst anmelden.</p>
                <Link to="/login" className="btn btn-primary">Jetzt anmelden</Link>
              </div>
            )
          } 
        />
        <Route 
          path="/post/:id" 
          element={<ExchangeDetail />} 
        />
      </Routes>
    </div>
  );
};

export default Exchange;
