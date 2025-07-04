// src/pages/Exchange/ExchangeList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock, User } from 'lucide-react';
import './ExchangeList.css';

const ExchangeList = ({ posts, loading, activeCategory, onRefresh }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">⏳</div>
        <p>Lade Anzeigen...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <h2>Keine Anzeigen gefunden</h2>
        <p>
          {activeCategory === 'alle' 
            ? 'Es gibt noch keine Anzeigen in dieser Kategorie.'
            : `Es gibt noch keine "${activeCategory}" Anzeigen.`
          }
        </p>
        <Link to="/exchange/create" className="btn btn-create">
          Erste Anzeige erstellen
        </Link>
      </div>
    );
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'verschenken': return '🎁';
      case 'tauschen': return '🔄';
      case 'suchen': return '🔍';
      default: return '📦';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'verschenken': return 'Verschenken';
      case 'tauschen': return 'Tauschen';
      case 'suchen': return 'Suchen';
      default: return category;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aktiv': return '#28a745';
      case 'reserviert': return '#ffc107';
      case 'abgeschlossen': return '#6c757d';
      default: return '#007bff';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Vor wenigen Minuten';
    if (diffHours < 24) return `Vor ${diffHours} Stunden`;
    if (diffDays < 7) return `Vor ${diffDays} Tagen`;
    return date.toLocaleDateString('de-DE');
  };

  if (activeCategory === 'alle') {
    // Nach Kategorie gruppieren
    const kategorien = [
      { key: 'verschenken', label: '🎁 Verschenken' },
      { key: 'tauschen', label: '🔄 Tauschen' },
      { key: 'suchen', label: '🔍 Suchen' }
    ];
    return (
      <div className="exchange-list">
        <div className="list-header">
          <h2>Alle Anzeigen <span className="count">({posts.length})</span></h2>
          <button onClick={onRefresh} className="refresh-btn">
            🔄 Aktualisieren
          </button>
        </div>
        {kategorien.map(kat => {
          const kPosts = posts.filter(p => p.category === kat.key);
          if (kPosts.length === 0) return null;
          return (
            <div key={kat.key} className="category-section">
              <h3>{kat.label}</h3>
              <div className="posts-grid">
                {kPosts.map(post => (
                  <Link
                    key={post._id}
                    to={`/exchange/post/${post._id}`}
                    className="post-card"
                  >
                    <div className="post-image">
                      <img src={post.picture} alt={post.title} />
                      <div 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(post.status) }}
                      >
                        {post.status === 'aktiv' ? 'Verfügbar' : 
                         post.status === 'reserviert' ? 'Reserviert' : 'Vergeben'}
                      </div>
                      <div className="category-badge">
                        {getCategoryIcon(post.category)} {getCategoryLabel(post.category)}
                      </div>
                    </div>
                    <div className="post-content">
                      <h3 className="post-title">{post.title}</h3>
                      <p className="post-description">
                        {post.description.length > 120 
                          ? `${post.description.substring(0, 120)}...` 
                          : post.description
                        }
                      </p>
                      {post.tauschGegen && (
                        <div className="trade-info">
                          <strong>Tausche gegen:</strong> {post.tauschGegen}
                        </div>
                      )}
                      <div className="post-meta">
                        <div className="author-info">
                          <User size={16} />
                          <span>{post.author?.nickname || 'Unbekannt'}</span>
                        </div>
                        <div className="post-stats">
                          <div className="stat">
                            <Eye size={14} />
                            <span>{post.views}</span>
                          </div>
                          <div className="stat">
                            <Clock size={14} />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
        {/* Hilfe-Abschnitt */}
        <div className="category-section help-section">
          <h3>❓ Hilfe</h3>
          <p>Du hast Fragen oder brauchst Unterstützung? <Link to="/help">Hier geht's zur Hilfeseite</Link>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exchange-list">
      <div className="list-header">
        <h2>
          {activeCategory === 'alle' ? 'Alle Anzeigen' : `${getCategoryLabel(activeCategory)} Anzeigen`}
          <span className="count">({posts.length})</span>
        </h2>
        <button onClick={onRefresh} className="refresh-btn">
          🔄 Aktualisieren
        </button>
      </div>

      <div className="posts-grid">
        {posts.map(post => (
          <Link
            key={post._id}
            to={`/exchange/post/${post._id}`}
            className="post-card"
          >
            <div className="post-image">
              <img src={post.picture} alt={post.title} />
              <div 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(post.status) }}
              >
                {post.status === 'aktiv' ? 'Verfügbar' : 
                 post.status === 'reserviert' ? 'Reserviert' : 'Vergeben'}
              </div>
              <div className="category-badge">
                {getCategoryIcon(post.category)} {getCategoryLabel(post.category)}
              </div>
            </div>

            <div className="post-content">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-description">
                {post.description.length > 120 
                  ? `${post.description.substring(0, 120)}...` 
                  : post.description
                }
              </p>

              {post.tauschGegen && (
                <div className="trade-info">
                  <strong>Tausche gegen:</strong> {post.tauschGegen}
                </div>
              )}

              <div className="post-meta">
                <div className="author-info">
                  <User size={16} />
                  <span>{post.author?.nickname || 'Unbekannt'}</span>
                </div>
                
                <div className="post-stats">
                  <div className="stat">
                    <Eye size={14} />
                    <span>{post.views}</span>
                  </div>
                  <div className="stat">
                    <Clock size={14} />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExchangeList;