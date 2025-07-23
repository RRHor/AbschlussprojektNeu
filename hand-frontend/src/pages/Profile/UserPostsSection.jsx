import React, { useState, useEffect } from 'react';

import './UserPostsSection.css'; 



const UserPostsSection = () => {
  const [activeTab, setActiveTab] = useState('alle');
  const [userPosts, setUserPosts] = useState({
    blogs: [],
    comments: []
  });
  const [exchangePosts, setExchangePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeExchangeTab, setActiveExchangeTab] = useState('alle');

  useEffect(() => {
    fetchUserContent();
  }, []);


  const fetchUserContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      const [blogsRes, commentsRes, exchangeRes] = await Promise.all([
        fetch(`${apiUrl}/my-posts`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/my-comments`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/exchange/my/posts`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!blogsRes.ok) throw new Error('Fehler beim Laden der Blogs');
      if (!commentsRes.ok) throw new Error('Fehler beim Laden der Kommentare');
      if (!exchangeRes.ok) throw new Error('Fehler beim Laden der Exchange-Posts');

      const [blogs, comments, exchangeData] = await Promise.all([
        blogsRes.json(),
        commentsRes.json(),
        exchangeRes.json()
      ]);

      setUserPosts({
        blogs: blogs,
        comments: comments
      });
      setExchangePosts(exchangeData.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Fehler beim Laden der Inhalte:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'alle', label: 'Alle', count: getTotalCount() },
    { id: 'blogs', label: 'Blogs', count: userPosts.blogs.length },
    { id: 'comments', label: 'Kommentare', count: userPosts.comments.length }
  ];

  function getTotalCount() {
    return userPosts.blogs.length + userPosts.comments.length;
  }

  function getFilteredPosts() {
    if (activeTab === 'alle') {
      return [
        ...userPosts.blogs.map(p => ({ ...p, _type: 'blog' })),
        ...userPosts.comments.map(p => ({ ...p, _type: 'comment' }))
      ];
    }
    return userPosts[activeTab] || [];
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Möchten Sie diesen Post wirklich löschen?')) {
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      // Den Typ des Posts ermitteln
      const post = getFilteredPosts().find(p => p._id === postId);
      let deleteUrl = '';
      if (post?._type === 'blog' || post?.category === 'blog') {
        deleteUrl = `${apiUrl}/blogs/${postId}`;
      } else if (post?._type === 'comment' || post?.category === 'comment') {
        // Korrekte Route laut Backend: /blogs-comments/:id
        deleteUrl = `${apiUrl}/blogs-comments/${postId}`;
      } else if (post?.category === 'tauschen') {
        deleteUrl = `${apiUrl}/exchanges/${postId}`;
      } else {
        // Fallback: exchanges
        deleteUrl = `${apiUrl}/exchanges/${postId}`;
      }

      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Fehler beim Löschen des Posts');
      }

      // Post aus dem lokalen State entfernen
      setUserPosts(prev => {
        const newPosts = { ...prev };
        Object.keys(newPosts).forEach(category => {
          newPosts[category] = newPosts[category].filter(post => post._id !== postId);
        });
        return newPosts;
      });

    } catch (err) {
      console.error('Fehler beim Löschen:', err);
      alert('Fehler beim Löschen des Posts: ' + err.message);
    }
  };

  const handleToggleStatus = async (postId) => {
    try {
      const post = getFilteredPosts().find(p => p._id === postId);
      const newStatus = post.status === 'aktiv' ? 'reserviert' : 'aktiv';

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/exchanges/${postId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Fehler beim Ändern des Status');
      }

      // Status im lokalen State aktualisieren
      setUserPosts(prev => {
        const newPosts = { ...prev };
        Object.keys(newPosts).forEach(category => {
          newPosts[category] = newPosts[category].map(post =>
            post._id === postId ? { ...post, status: newStatus } : post
          );
        });
        return newPosts;
      });

    } catch (err) {
      console.error('Fehler beim Status ändern:', err);
      alert('Fehler beim Ändern des Status: ' + err.message);
    }
  };

  const handleEditPost = async (postId) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const post = getFilteredPosts().find(p => p._id === postId);
    if (!post) return;
    if (post._type === 'blog' || post.category === 'blog') {
      // Blog bearbeiten
      const newTitle = prompt('Neuer Titel:', post.title);
      if (newTitle === null) return;
      const newDescription = prompt('Neue Beschreibung:', post.description);
      if (newDescription === null) return;
      try {
        const response = await fetch(`${apiUrl}/blogs/${postId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title: newTitle, description: newDescription })
        });
        if (!response.ok) throw new Error('Fehler beim Bearbeiten des Blogposts');
        setUserPosts(prev => {
          const newPosts = { ...prev };
          newPosts.blogs = newPosts.blogs.map(b => b._id === postId ? { ...b, title: newTitle, description: newDescription } : b);
          return newPosts;
        });
      } catch (err) {
        alert('Fehler beim Bearbeiten: ' + err.message);
      }
    } else if (post._type === 'comment' || post.category === 'comment') {
      // Kommentar bearbeiten
      const newText = prompt('Neuer Kommentartext:', post.text);
      if (newText === null) return;
      try {
        const response = await fetch(`${apiUrl}/blogs-comments/${postId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: newText })
        });
        if (!response.ok) throw new Error('Fehler beim Bearbeiten des Kommentars');
        setUserPosts(prev => {
          const newPosts = { ...prev };
          newPosts.comments = newPosts.comments.map(c => c._id === postId ? { ...c, text: newText } : c);
          return newPosts;
        });
      } catch (err) {
        alert('Fehler beim Bearbeiten: ' + err.message);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aktiv': return '#22c55e';
      case 'reserviert': return '#f59e0b';
      case 'abgeschlossen': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'aktiv': return 'Aktiv';
      case 'reserviert': return 'Reserviert';
      case 'abgeschlossen': return 'Abgeschlossen';
      default: return status;
    }
  };


  // Icon und Label je nach Typ
  const getCategoryIcon = (type) => {
    switch (type) {
      case 'blog': return '📝';
      case 'comment': return '💬';
      case 'tauschen': return '🔄';
      case 'suchen': return '🔍';
      case 'hilfe': return '🤝';
      case 'verschenken': return '🎁';
      default: return '';
    }
  };
  const getCategoryLabel = (type) => {
    switch (type) {
      case 'blog': return 'Blog';
      case 'comment': return 'Kommentar';
      case 'tauschen': return 'Tauschen';
      case 'suchen': return 'Suchen';
      case 'hilfe': return 'Hilfe';
      case 'verschenken': return 'Verschenken';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="user-posts-section">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Lade Ihre Posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-posts-section">
        <div className="error-message">
          <h3>Fehler beim Laden</h3>
          <p>{error}</p>
          <button onClick={fetchUserContent} className="btn btn-primary">
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }




  // Exchange-Tabs

  // Hilfsfunktion für Kategorie-Mapping (Singular/Plural)
  const matchCategory = (cat, tabId) => {
    if (tabId === 'tauschen') return cat === 'tauschen' || cat === 'tausch';
    if (tabId === 'verschenken') return cat === 'verschenken' || cat === 'verschenke';
    if (tabId === 'suchen') return cat === 'suchen' || cat === 'suche';
    if (tabId === 'hilfe') return cat === 'hilfe';
    return false;
  };

  const exchangeTabs = [
    { id: 'alle', label: 'Alle', count: exchangePosts.length },
    { id: 'tauschen', label: 'Tauschen', count: exchangePosts.filter(p => matchCategory(p.category, 'tauschen')).length },
    { id: 'verschenken', label: 'Verschenken', count: exchangePosts.filter(p => matchCategory(p.category, 'verschenken')).length },
    { id: 'suchen', label: 'Suchen', count: exchangePosts.filter(p => matchCategory(p.category, 'suchen')).length },
    { id: 'hilfe', label: 'Hilfe', count: exchangePosts.filter(p => matchCategory(p.category, 'hilfe')).length },
  ];

  // Gefilterte Exchange-Posts
  const getFilteredExchangePosts = () => {
    if (activeExchangeTab === 'alle') return exchangePosts;
    return exchangePosts.filter(p => matchCategory(p.category, activeExchangeTab));
  };

  return (
    <div className="user-posts-section">
      <div className="posts-header">
        <h3 className="section-title">Meine Anzeigen & Aktivitäten</h3>
        <p className="section-subtitle">Verwalten Sie Ihre Beiträge und Aktivitäten</p>
      </div>

      {/* Filter Tabs */}
      <div className="posts-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="posts-container">
        {getFilteredPosts().length === 0 ? (
          <div className="no-posts">
            <div className="no-posts-icon">📝</div>
            <h4>Keine Einträge gefunden</h4>
            <p>
              {activeTab === 'alle' 
                ? 'Sie haben noch keine Einträge erstellt.' 
                : `Sie haben noch keine ${tabs.find(t => t.id === activeTab)?.label} erstellt.`
              }
            </p>
          </div>
        ) : (
          <div className="posts-grid">
            {getFilteredPosts().map(post => (
              <div key={post._id || post._id_comment} className="post-card">
                {/* ...wie gehabt... */}
                {/* ...bestehende Anzeige-Logik... */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exchange-Posts Extra-Karte mit Tabs */}
      <div className="exchange-section">
        <div className="posts-tabs" style={{marginTop: '2rem'}}>
          {exchangeTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveExchangeTab(tab.id)}
              className={`tab-button ${activeExchangeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>
        {getFilteredExchangePosts().length === 0 ? (
          <div className="no-posts">
            <div className="no-posts-icon">🔄</div>
            <h4>Keine Einträge in dieser Rubrik gefunden</h4>
          </div>
        ) : (
          <div className="posts-grid">
            {getFilteredExchangePosts().map(post => (
              <div key={post._id} className="post-card">
                <div className="post-card-header">
                  <div className="post-category">
                    <span className="category-icon">{getCategoryIcon(post.category)}</span>
                    <span className="category-label">{getCategoryLabel(post.category)}</span>
                  </div>
                  {post.status && (
                    <div className="post-status">
                      <span className="status-indicator" style={{ backgroundColor: getStatusColor(post.status) }}></span>
                      <span className="status-text">{getStatusText(post.status)}</span>
                    </div>
                  )}
                </div>
                {post.image && (
                  <div className="post-image">
                    <img src={post.image} alt={post.title || 'Bild'} />
                  </div>
                )}
                <div className="post-content">
                  <h4 className="post-title">{post.title}</h4>
                  <p className="post-description">{post.description}</p>
                  {post.category === 'tauschen' && post.tauschGegen && (
                    <div className="tausch-info">
                      <span className="tausch-label">Tausche gegen:</span>
                      <span className="tausch-gegen">{post.tauschGegen}</span>
                    </div>
                  )}
                  <div className="post-meta">
                    <div className="post-date">
                      <span className="meta-icon">📅</span>
                      {formatDate(post.createdAt)}
                    </div>
                    {post.updatedAt && post.updatedAt !== post.createdAt && (
                      <div className="post-updated">
                        <span className="meta-icon">✏️</span>
                        Bearbeitet: {formatDate(post.updatedAt)}
                      </div>
                    )}
                  </div>
                  <div className="post-stats">
                    <div className="stat-item">
                      <span className="stat-icon">👁️</span>
                      <span className="stat-value">{post.views || 0}</span>
                      <span className="stat-label">Aufrufe</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">❤️</span>
                      <span className="stat-value">{post.interested || 0}</span>
                      <span className="stat-label">Interessenten</span>
                    </div>
                  </div>
                </div>
                <div className="post-actions">
                  <button 
                    onClick={() => handleEditPost(post._id)}
                    className="btn btn-post-edit"
                  >
                    <span className="btn-icon">✏️</span>
                    Bearbeiten
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(post._id)}
                    className="btn btn-post-toggle"
                    disabled={!post.status}
                  >
                    <span className="btn-icon">
                      {post.status === 'aktiv' ? '⏸️' : '▶️'}
                    </span>
                    {post.status === 'aktiv' ? 'Reservieren' : 'Aktivieren'}
                  </button>
                  <button 
                    onClick={() => handleDeletePost(post._id)}
                    className="btn btn-post-delete"
                  >
                    <span className="btn-icon">🗑️</span>
                    Löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPostsSection;