import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserPostsSection.css';

const API_URL = import.meta.env.VITE_API_URL;

const UserPostsSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('alle');
  const [editPostId, setEditPostId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [userPosts, setUserPosts] = useState({
    verschenken: [],
    tauschen: [],
    suchen: [],
    blog: [],
    events: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      // Alle relevanten Endpunkte parallel abfragen (Exchanges, Blog-Kommentare, Event-Kommentare)
      const [exchangesRes, blogRes, eventRes] = await Promise.all([
        fetch(`${API_URL}/api/exchange/my/posts`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_URL}/api/blog-comments/user`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_URL}/api/event-comments/user`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!exchangesRes.ok || !blogRes.ok || !eventRes.ok) {
        const text = !exchangesRes.ok ? await exchangesRes.text() : !blogRes.ok ? await blogRes.text() : await eventRes.text();
        throw new Error(`Fehler beim Laden der Daten: ${text}`);
      }

      let exchangesData, blogData, eventData;
      try {
        exchangesData = await exchangesRes.json();
        blogData = await blogRes.json();
        eventData = await eventRes.json();
      } catch (jsonErr) {
        throw new Error('Antwort ist kein gültiges JSON. Prüfe die API-URL und Backend-Response.');
      }

      const exchangeList = Array.isArray(exchangesData.data) ? exchangesData.data : [];
      const sortedPosts = {
        verschenken: exchangeList.filter(post => post.category === 'verschenken'),
        tauschen: exchangeList.filter(post => post.category === 'tauschen'),
        suchen: exchangeList.filter(post => post.category === 'suchen'),
        blog: blogData,
        events: eventData
      };
      setUserPosts(sortedPosts);
    } catch (err) {
      setError(err.message);
      console.error('Fehler beim Laden der Posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'alle', label: 'Alle', count: getTotalCount() },
    { id: 'verschenken', label: 'Verschenken', count: userPosts.verschenken.length },
    { id: 'tauschen', label: 'Tauschen', count: userPosts.tauschen.length },
    { id: 'suchen', label: 'Suchen', count: userPosts.suchen.length },
    { id: 'blog', label: 'Blog Kommentare', count: userPosts.blog.length },
    { id: 'events', label: 'Events', count: userPosts.events.length }
  ];

  function getTotalCount() {
    return Object.values(userPosts).reduce((total, posts) => total + posts.length, 0);
  }

  function getFilteredPosts() {
    if (activeTab === 'alle') {
      return Object.values(userPosts).flat().sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    }
    return userPosts[activeTab] || [];
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Möchten Sie diesen Post wirklich löschen?')) {
      return;
    }
    try {
      // Den Post in allen Kategorien suchen, um den Typ zu bestimmen
      let post = null;
      Object.values(userPosts).forEach(postsArr => {
        if (!post) post = postsArr.find(p => p._id === postId);
      });
      let url = '';
      if (post?.blog && post?.text) {
        url = `${API_URL}/api/blog-comments/${postId}`;
      } else if (post?.event && post?.text) {
        url = `${API_URL}/api/event-comments/${postId}`;
      } else {
        url = `${API_URL}/api/exchange/${postId}`;
      }
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Fehler beim Löschen des Posts');
      }
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
      const response = await fetch(`${API_URL}/api/exchange/${postId}/status`, {
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

  const handleEditPost = (post) => {
    setEditPostId(post._id);
    // Initialwerte je nach Typ
    if (post.blog && post.text) {
      setEditForm({ text: post.text });
    } else if (post.event && post.text) {
      setEditForm({ text: post.text });
    } else {
      setEditForm({
        title: post.title || '',
        description: post.description || '',
        tauschGegen: post.tauschGegen || ''
      });
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditCancel = () => {
    setEditPostId(null);
    setEditForm({});
  };

  const handleEditSave = async (post) => {
    try {
      let url = '';
      let method = 'PUT';
      let body = {};
      if (post.blog && post.text) {
        url = `${API_URL}/api/blog-comments/${post._id}`;
        body = { text: editForm.text };
      } else if (post.event && post.text) {
        url = `${API_URL}/api/event-comments/${post._id}`;
        body = { text: editForm.text };
      } else {
        url = `${API_URL}/api/exchange/${post._id}`;
        body = {
          title: editForm.title,
          description: editForm.description,
          tauschGegen: post.category === 'tauschen' ? editForm.tauschGegen : undefined
        };
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) throw new Error('Fehler beim Speichern');
      await fetchUserPosts();
      setEditPostId(null);
      setEditForm({});
    } catch (err) {
      alert('Fehler beim Speichern: ' + err.message);
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'verschenken': return '🎁';
      case 'tauschen': return '🔄';
      case 'suchen': return '🔍';
      case 'blog': return '💬';
      case 'events': return '📅';
      default: return '📝';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'verschenken': return 'Verschenken';
      case 'tauschen': return 'Tauschen';
      case 'suchen': return 'Suchen';
      case 'blog': return 'Blog';
      case 'events': return 'Events';
      default: return category;
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
          <button onClick={fetchUserPosts} className="btn btn-primary">
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

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
            <h4>Keine Beiträge gefunden</h4>
            <p>
              {activeTab === 'alle' 
                ? 'Sie haben noch keine Beiträge erstellt.' 
                : `Sie haben noch keine ${tabs.find(t => t.id === activeTab)?.label} erstellt.`
              }
            </p>
            <button 
              onClick={() => navigate('/create-post')} 
              className="btn btn-primary"
            >
              Ersten Post erstellen
            </button>
          </div>
        ) : (
          <div className="posts-grid">
            {getFilteredPosts().map(post => (
              <div key={post._id} className="post-card">
                <div className="post-card-header">
                  <div className="post-category">
                    <span className="category-icon">{getCategoryIcon(post.category)}</span>
                    <span className="category-label">{getCategoryLabel(post.category)}</span>
                  </div>
                  <div className="post-status">
                    <span 
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(post.status) }}
                    ></span>
                    <span className="status-text">{getStatusText(post.status)}</span>
                  </div>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="post-image">
                    <img src={post.image} alt={post.title} />
                  </div>
                )}


                <div className="post-content">
                  {editPostId === post._id ? (
                    <form onSubmit={e => { e.preventDefault(); handleEditSave(post); }} className="edit-form">
                      {/* Blog-Kommentar */}
                      {post.blog && post.text ? (
                        <>
                          <h4 className="post-title">Kommentar zu: {post.blog.title}</h4>
                          <textarea name="text" value={editForm.text || ''} onChange={handleEditFormChange} className="edit-input" rows={3} />
                        </>
                      ) : post.event && post.text ? (
                        <>
                          <h4 className="post-title">Kommentar zu Event: {post.event.title}</h4>
                          <textarea name="text" value={editForm.text || ''} onChange={handleEditFormChange} className="edit-input" rows={3} />
                        </>
                      ) : (
                        <>
                          <input name="title" value={editForm.title || ''} onChange={handleEditFormChange} className="edit-input" placeholder="Titel" />
                          <textarea name="description" value={editForm.description || ''} onChange={handleEditFormChange} className="edit-input" placeholder="Beschreibung" rows={3} />
                          {post.category === 'tauschen' && (
                            <input name="tauschGegen" value={editForm.tauschGegen || ''} onChange={handleEditFormChange} className="edit-input" placeholder="Tausche gegen..." />
                          )}
                        </>
                      )}
                      <div className="edit-actions">
                        <button type="submit" className="btn btn-primary">Speichern</button>
                        <button type="button" className="btn btn-secondary" onClick={handleEditCancel}>Abbrechen</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      {/* ...bestehende Anzeige wie bisher... */}
                      {post.blog && post.text ? (
                        <>
                          <h4 className="post-title">Kommentar zu: {post.blog.title}</h4>
                          <p className="post-description">{post.text}</p>
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
                        </>
                      ) : post.event && post.text ? (
                        <>
                          <h4 className="post-title">Kommentar zu Event: {post.event.title}</h4>
                          <p className="post-description">{post.text}</p>
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
                        </>
                      ) : (
                        <>
                          <h4 className="post-title">{post.title}</h4>
                          <p className="post-description">{post.description}</p>
                          {/* Tausch-Gegen Info für Tausch-Posts */}
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
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className="post-actions">
                  {editPostId === post._id ? null : (
                    <>
                      <button 
                        onClick={() => handleEditPost(post)}
                        className="btn btn-post-edit"
                      >
                        <span className="btn-icon">✏️</span>
                        Bearbeiten
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(post._id)}
                        className="btn btn-post-toggle"
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
                    </>
                  )}
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