import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Edit3, Save, X, Camera, Loader, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import exchangeService from '../services/exchangeService';
import './Profile.css';
import Footer from '../components/Footer';

const emptyAddress = {
  street: '',
  city: '',

  zip: '',
  state: '',
  district: ''
};

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // STATES - Profil-Daten
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nickname: '',
    email: '',
    firstName: '',
    lastName: '',
    addresses: [ { ...emptyAddress } ],
    profileImage: null
  });
  
  const [editData, setEditData] = useState({ ...profileData });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // STATES - Exchange Posts
  const [myExchangePosts, setMyExchangePosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // STATES - Events & Navigation
  const [activeTab, setActiveTab] = useState('profile');
  const [userEvents, setUserEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // User-Daten laden
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/auth/users/me');
        const data = response.data;
        setProfileData({
          nickname: data.nickname || '',
          email: data.email || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          addresses: Array.isArray(data.addresses) && data.addresses.length > 0
            ? data.addresses
            : [ { ...emptyAddress } ],
          profileImage: data.profileImage || null
        });
        setEditData({
          nickname: data.nickname || '',
          email: data.email || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          addresses: Array.isArray(data.addresses) && data.addresses.length > 0
            ? data.addresses
            : [ { ...emptyAddress } ],
          profileImage: data.profileImage || null
        });
        setError(null);
      } catch (error) {
        setError('Fehler beim Laden der Profildaten');
      } finally {
        setIsLoading(false);
      }
    };
    if (!authLoading && user) fetchUserData();
  }, [user, authLoading]);



  // Exchange Posts laden
  useEffect(() => {
    const fetchMyExchangePosts = async () => {
      setLoadingPosts(true);
      try {
        const result = await exchangeService.getMyPosts();
        if (result.success) setMyExchangePosts(result.data);
      } catch (error) {
        // Fehler ignorieren
      } finally {
        setLoadingPosts(false);
      }
    };
    if (profileData.nickname) fetchMyExchangePosts();
  }, [profileData.nickname]);

  // Events laden wenn Events-Tab aktiv
  useEffect(() => {
    if (activeTab === 'events' && user) loadUserEvents();
    // eslint-disable-next-line
  }, [activeTab, user]);

  // User-Events von Backend laden
  const loadUserEvents = async () => {
    try {
      setEventsLoading(true);
      const response = await api.get('/auth/users/me/events');
      setUserEvents(response.data.events || []);
    } catch (error) {
      setUserEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  // Event-Detail-Seite öffnen
  const handleEventClick = (event) => {
    navigate(`/events/${event._id}`, { state: { event } });
  };

  // Bearbeiten/Speichern
  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updateData = {
        nickname: editData.nickname,
        email: editData.email,
        firstName: editData.firstName,
        lastName: editData.lastName,
        addresses: [
          {
            street: editData.addresses?.[0]?.street || '',
            city: editData.addresses?.[0]?.city || '',
            zip: editData.addresses?.[0]?.zip || '',
            state: editData.addresses?.[0]?.state || '',
            district: editData.addresses?.[0]?.district || ''
          }
        ]
      };
      await api.put('/auth/users/me', updateData);
      setProfileData({ ...editData });
      setIsEditing(false);
      setError(null);
      alert('Profil erfolgreich aktualisiert!');
    } catch (error) {
      setError('Fehler beim Speichern der Änderungen');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      addresses: [
        {
          ...prev.addresses[0],
          [field]: value
        }
      ]
    }));
  };

  // Profilbild hochladen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Bild ist zu groß (max. 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isEditing) {
          setEditData(prev => ({ ...prev, profileImage: e.target.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Exchange-Post löschen
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Sind Sie sicher, dass Sie diese Anzeige löschen möchten?')) return;
    try {
      const result = await exchangeService.deletePost(postId);
      if (result.success) {
        setMyExchangePosts(prev => prev.filter(post => post._id !== postId));
        alert('Anzeige erfolgreich gelöscht!');
      }
    } catch {
      alert('Fehler beim Löschen der Anzeige');
    }
  };

  // Exchange-Post Status ändern
  const handleStatusChange = async (postId, newStatus) => {
    try {
      const result = await exchangeService.updateStatus(postId, newStatus);
      if (result.success) {
        setMyExchangePosts(prev =>
          prev.map(post =>
            post._id === postId ? { ...post, status: newStatus } : post
          )
        );
      }
    } catch {
      alert('Fehler beim Ändern des Status');
    }
  };

  // Exchange-Post bearbeiten
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowEditModal(true);
  };

  const handleUpdatePost = async (postId, updatedData) => {
    try {
      const result = await exchangeService.updatePost(postId, updatedData);
      if (result.success) {
        setMyExchangePosts(prev =>
          prev.map(post =>
            post._id === postId ? result.data : post
          )
        );
        setShowEditModal(false);
        setEditingPost(null);
        alert('Anzeige erfolgreich aktualisiert!');
      }
    } catch {
      alert('Fehler beim Aktualisieren der Anzeige');
    }
  };

  // LOADING & ERROR STATES
  if (authLoading || isLoading) {
    return (
      <div className="profile-container">
        <div className="loading">
          <Loader className="spinner" />
          Lade Profildaten...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  // MAIN RENDER
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-wrapper">
          {/* Header */}
          <div className="profile-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Mein Profil</h1>
                <p>Verwalten Sie Ihre persönlichen Daten</p>
              </div>
              <div className="header-buttons">
                {!isEditing ? (
                  <button onClick={handleEdit} className="btn btn-edit">
                    <Edit3 size={18} />
                    Bearbeiten
                  </button>
                ) : (
                  <div className="btn-group">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="btn btn-save"
                    >
                      {isSaving ? <Loader size={18} className="spinner" /> : <Save size={18} />}
                      {isSaving ? 'Speichern...' : 'Speichern'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="btn btn-cancel"
                    >
                      <X size={18} />
                      Abbrechen
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            Profil
          </button>
          <button
            className={`tab-button ${activeTab === 'exchange' ? 'active' : ''}`}
            onClick={() => setActiveTab('exchange')}
          >
            <MapPin size={18} />
            Exchange ({myExchangePosts.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('events');
              if (userEvents.length === 0) {
                loadUserEvents();
              }
            }}
          >
            <Calendar size={18} />
            Events ({userEvents.length})
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="profile-content">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="profile-grid">
              {/* Profilbild-Section */}
              <div className="profile-image-section">
                <div className="image-container">
                  <div className="profile-image">
                    {editData.profileImage || profileData.profileImage ? (
                      <img
                        src={isEditing ? editData.profileImage : profileData.profileImage}
                        alt="Profilbild"
                      />
                    ) : (
                      <div className="default-avatar">
                        <User size={48} />
                      </div>
                    )}
                    {isEditing && (
                      <label className="image-upload-btn">
                        <Camera size={20} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>
                  <h2 className="profile-name">
                    {(editData.firstName || editData.lastName) && isEditing
                      ? `${editData.firstName} ${editData.lastName}`.trim()
                      : (profileData.firstName || profileData.lastName)
                        ? `${profileData.firstName} ${profileData.lastName}`.trim()
                        : 'Unbekannter Benutzer'}
                  </h2>
                  <p className="profile-username">
                    @{profileData.nickname || 'unbekannt'}
                  </p>
                </div>
              </div>

              {/* Formular-Section */}
              <div className="profile-form-section">
                {/* Account Informationen */}
                <div className="form-group">
                  <h3 className="section-title">
                    <User size={20} />
                    Account Informationen
                  </h3>
                  <div className="form-row">
                    <div className="input-group">
                      <label>Benutzername</label>
                      <div className="input-container">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.nickname}
                            onChange={e => handleInputChange('nickname', e.target.value)}
                          />
                        ) : (
                          <div className="input-display">{profileData.nickname || 'Nicht angegeben'}</div>
                        )}
                      </div>
                    </div>
                    <div className="input-group">
                      <label>E-Mail</label>
                      <div className="input-container">
                        {isEditing ? (
                          <input
                            type="email"
                            value={editData.email}
                            onChange={e => handleInputChange('email', e.target.value)}
                          />
                        ) : (
                          <div className="input-display">{profileData.email || 'Nicht angegeben'}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Persönliche Daten */}
                <div className="form-group">
                  <h3 className="section-title">
                    <User size={20} />
                    Persönliche Daten
                  </h3>
                  <div className="form-row">
                    <div className="input-group">
                      <label>Vorname</label>
                      <div className="input-container">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.firstName}
                            onChange={e => handleInputChange('firstName', e.target.value)}
                          />
                        ) : (
                          <div className="input-display">{profileData.firstName || 'Nicht angegeben'}</div>
                        )}
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Nachname</label>
                      <div className="input-container">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.lastName}
                            onChange={e => handleInputChange('lastName', e.target.value)}
                          />
                        ) : (
                          <div className="input-display">{profileData.lastName || 'Nicht angegeben'}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Adress-Informationen */}
                <div className="form-group">
                  <h3 className="section-title">
                    <MapPin size={20} />
                    Adresse
                  </h3>
                  <div className="input-group">
                    <label>Straße und Hausnummer</label>
                    <div className="input-container">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.addresses?.[0]?.street || ''}
                          onChange={e => handleAddressChange('street', e.target.value)}
                        />
                      ) : (
                        <div className="input-display">{profileData.addresses?.[0]?.street || 'Nicht angegeben'}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-row adress-row">
                    <div className="input-group">
                      <label>PLZ</label>
                      <div className="input-container">
                        {isEditing ? (
                        <input
                          type="text"
                          value={editData.addresses?.[0]?.zip || ''}
                          onChange={e => handleAddressChange('zip', e.target.value)}
                          maxLength="5"
                        />
                      ) : (
                          <div className="input-display">{profileData.addresses?.[0]?.zip || 'Nicht angegeben'}</div>
                        )}
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Stadt</label>
                      <div className="input-container">
                        {isEditing ? (
                        <input
                          type="text"
                          value={editData.addresses?.[0]?.city || ''}
                          onChange={e => handleAddressChange('city', e.target.value)}
                        />
                      ) : (
                          <div className="input-display">{profileData.addresses?.[0]?.city || 'Nicht angegeben'}</div>
                        )}
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Bundesland</label>
                      <div className="input-container">
                        {isEditing ? (
                        <input
                          type="text"
                          value={editData.addresses?.[0]?.state || ''}
                          onChange={e => handleAddressChange('state', e.target.value)}
                        />
                      ) : (
                          <div className="input-display">{profileData.addresses?.[0]?.state || 'Nicht angegeben'}</div>
                        )}
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Ortsteil</label>
                      <div className="input-container">
                        {isEditing ? (
                        <input
                          type="text"
                          value={editData.addresses?.[0]?.district || ''}
                          onChange={e => handleAddressChange('district', e.target.value)}
                        />
                      ) : (
                          <div className="input-display">{profileData.addresses?.[0]?.district || 'Nicht angegeben'}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EXCHANGE TAB */}
          {activeTab === 'exchange' && (
            <div className="exchange-content">
              <h2 className="section-title">
                <MapPin size={20} />
                Meine Exchange-Anzeigen
              </h2>
              {loadingPosts ? (
                <div className="loading-spinner">
                  <Loader className="spinner" />
                  Lade Anzeigen...
                </div>
              ) : myExchangePosts.length === 0 ? (
                <div className="no-posts">
                  <div className="no-posts-icon">📦</div>
                  <h3>Keine Anzeigen</h3>
                  <p>Sie haben noch keine Exchange-Anzeigen erstellt.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/exchange')}
                  >
                    Erste Anzeige erstellen
                  </button>
                </div>
              ) : (
                <div className="exchange-posts-grid">
                  {myExchangePosts.map(post => (
                    <div key={post._id} className="exchange-post-card">
                      <div className="post-image">
                        <img src={post.picture} alt={post.title} />
                        <div className={`status-badge status-${post.status}`}>
                          {post.status === 'aktiv' ? 'Aktiv' :
                            post.status === 'reserviert' ? 'Reserviert' : 'Abgeschlossen'}
                        </div>
                      </div>
                      <div className="post-content">
                        <div className="post-header">
                          <h3 className="post-title">{post.title}</h3>
                          <span className={`category-badge category-${post.category}`}>
                            {post.category === 'verschenken' ? '🎁 Verschenken' :
                              post.category === 'tauschen' ? '🔄 Tauschen' : '🔍 Suchen'}
                          </span>
                        </div>
                        <p className="post-description">{post.description}</p>
                        {post.tauschGegen && (
                          <p className="post-trade">
                            <strong>Tausche gegen:</strong> {post.tauschGegen}
                          </p>
                        )}
                        <div className="post-meta">
                          <span className="post-date">
                            Erstellt: {new Date(post.createdAt).toLocaleDateString('de-DE')}
                          </span>
                          <span className="post-views">👁 {post.views} Aufrufe</span>
                        </div>
                        <div className="post-actions">
                          <select
                            value={post.status}
                            onChange={e => handleStatusChange(post._id, e.target.value)}
                            className="status-select"
                          >
                            <option value="aktiv">Aktiv</option>
                            <option value="reserviert">Reserviert</option>
                            <option value="abgeschlossen">Abgeschlossen</option>
                          </select>
                          <button
                            className="btn-action btn-edit-post"
                            onClick={() => handleEditPost(post)}
                          >
                            ✏️ Bearbeiten
                          </button>
                          <button
                            className="btn-action btn-delete-post"
                            onClick={() => handleDeletePost(post._id)}
                          >
                            🗑️ Löschen
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="events-content">
              <h2 className="section-title">
                <Calendar size={20} />
                Meine Events
              </h2>
              {eventsLoading ? (
                <div className="loading-spinner">
                  <Loader className="spinner" />
                  Lade Events...
                </div>
              ) : userEvents.length === 0 ? (
                <div className="no-events">
                  <div className="no-events-icon">📅</div>
                  <h3>Keine Events</h3>
                  <p>Du nimmst aktuell an keinen Events teil.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/events')}
                  >
                    Events durchsuchen
                  </button>
                </div>
              ) : (
                <div className="user-events-grid">
                  {userEvents.map(event => (
                    <div
                      key={event._id}
                      className="user-event-card"
                      onClick={() => handleEventClick(event)}
                    >
                      {/* Event-Bild */}
                      <div className="event-image">
                        <img
                          src={event.image || '/placeholder-event.jpg'}
                          alt={event.title}
                          onError={e => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="event-placeholder" style={{ display: 'none' }}>
                          <Calendar size={48} />
                        </div>
                      </div>
                      {/* Event-Informationen */}
                      <div className="event-info">
                        <h3>{event.title}</h3>
                        <div className="event-meta">
                          <div className="event-date">
                            <Calendar size={16} />
                            {new Date(event.date).toLocaleDateString('de-DE')}
                          </div>
                          <div className="event-location">
                            <MapPin size={16} />
                            {event.location}
                          </div>
                          <div className="event-participants">
                            <Users size={16} />
                            {event.participants?.length || 0} Teilnehmer
                          </div>
                        </div>
                        <p className="event-description">
                          {event.description?.substring(0, 100)}
                          {event.description?.length > 100 && '...'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL - Exchange-Post bearbeiten */}
        {showEditModal && editingPost && (
          <div className="edit-post-modal">
            <div className="modal-content">
              <h3>Anzeige bearbeiten</h3>
              <div className="modal-body">
                <div className="input-group">
                  <label>Titel</label>
                  <input
                    type="text"
                    value={editingPost.title}
                    onChange={e => setEditingPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titel der Anzeige"
                  />
                </div>
                <div className="input-group">
                  <label>Beschreibung</label>
                  <textarea
                    value={editingPost.description}
                    onChange={e => setEditingPost(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Beschreibung der Anzeige"
                  />
                </div>
                <div className="input-group">
                  <label>Status</label>
                  <select
                    value={editingPost.status}
                    onChange={e => setEditingPost(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="active">Aktiv</option>
                    <option value="inactive">Inaktiv</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  onClick={() => handleUpdatePost(editingPost._id, editingPost)}
                  className="btn btn-save"
                >
                  Speichern
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-cancel"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Profile;