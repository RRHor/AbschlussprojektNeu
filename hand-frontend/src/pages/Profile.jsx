import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, MapPin, Edit3, Save, X, Camera, Loader } from 'lucide-react';
import api from '../api';
import exchangeService from '../services/exchangeService';
import './Profile.css';
import ExchangeEditModal from '../components/ExchangeEditModal';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    state: '',
    city: '',
    zip: '',
    street: '',
    profileImage: null
  });
  const [editData, setEditData] = useState({ ...profileData });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Exchange Posts States
  const [myExchangePosts, setMyExchangePosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // User-Daten laden
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/auth/users/me');
        
        const formattedData = {
          username: response.data.nickname || '',
          email: response.data.email || '',
          firstName: response.data.adress?.[0]?.firstName || '',
          lastName: response.data.adress?.[0]?.lastName || '',
          state: response.data.adress?.[0]?.state || '',
          city: response.data.adress?.[0]?.city || '',
          zip: response.data.adress?.[0]?.zip || '',
          street: response.data.adress?.[0]?.street || '',
          profileImage: response.data.profileImage || null
        };
        
        setProfileData(formattedData);
        setEditData(formattedData);
        setError(null);
      } catch (error) {
        console.error('Fehler beim Laden der User-Daten:', error);
        setError('Fehler beim Laden der Profildaten');
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchUserData();
    }
  }, [user, authLoading]);

  // Fetch Exchange Posts
  useEffect(() => {
    const fetchMyExchangePosts = async () => {
      setLoadingPosts(true);
      try {
        const result = await exchangeService.getMyPosts();
        if (result.success) {
          setMyExchangePosts(result.data);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Exchange-Posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    if (profileData) {
      fetchMyExchangePosts();
    }
  }, [profileData]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // DEBUG: Prüfe die tatsächliche API-URL
      console.log('🔍 API Base URL:', api.defaults.baseURL);
      
      const token = localStorage.getItem('token');
      console.log('🔍 Frontend Token:', token ? 'VORHANDEN' : 'NICHT VORHANDEN');
      console.log('🔍 Token Inhalt:', token);
      console.log('🔍 AuthContext User:', user);
      
      const updateData = {
        nickname: editData.username,
        email: editData.email,
      };

      if (editData.firstName || editData.lastName || editData.street || editData.city) {
        updateData.adress = [{
          firstName: editData.firstName,
          lastName: editData.lastName,
          street: editData.street,
          city: editData.city,
          state: editData.state,
          zip: editData.zip ? parseInt(editData.zip, 10) : null
        }];
      }

      console.log('🔍 Update Data:', updateData);
      
      const response = await api.put('/auth/users/me', updateData);
      
      if (response.status === 200) {
        setProfileData({ ...editData });
        setIsEditing(false);
        setError(null);
        alert('Profil erfolgreich aktualisiert!');
      }
    } catch (error) {
      console.error('🚨 Fehler beim Speichern:', error);
      console.error('🚨 Error Response:', error.response?.data);
      console.error('🚨 Error Status:', error.response?.status);
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validierung
      if (file.size > 5 * 1024 * 1024) { // 5MB
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

  // Delete Post
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Sind Sie sicher, dass Sie diese Anzeige löschen möchten?')) {
      return;
    }

    try {
      const result = await exchangeService.deletePost(postId);
      if (result.success) {
        setMyExchangePosts(prev => prev.filter(post => post._id !== postId));
        alert('Anzeige erfolgreich gelöscht!');
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      alert('Fehler beim Löschen der Anzeige');
    }
  };

  // Update Post Status
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
    } catch (error) {
      console.error('Fehler beim Status-Update:', error);
      alert('Fehler beim Ändern des Status');
    }
  };

  // Edit Post
  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowEditModal(true);
  };

  // Update Post
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
    } catch (error) {
      console.error('Fehler beim Update:', error);
      alert('Fehler beim Aktualisieren der Anzeige');
    }
  };

  // Loading State
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

  // Error State
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

  return (
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

        {/* Main Content */}
        <div className="profile-content">
          <div className="profile-grid">
            {/* Profile Image Section */}
            <div className="profile-image-section">
              <div className="image-container">
                <div className="profile-image">
                  {(isEditing ? editData.profileImage : profileData.profileImage) ? (
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
                  {profileData.firstName || profileData.lastName 
                    ? `${profileData.firstName} ${profileData.lastName}`.trim()
                    : 'Unbekannter Benutzer'
                  }
                </h2>
                <p className="profile-username">
                  @{profileData.username || 'unbekannt'}
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="profile-form-section">
              {/* Account Information */}
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
                          value={editData.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          
                        />
                      ) : (
                        <div className="input-display">{profileData.username || 'Nicht angegeben'}</div>
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
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      ) : (
                        <div className="input-display">{profileData.email || 'Nicht angegeben'}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
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
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          
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
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          
                        />
                      ) : (
                        <div className="input-display">{profileData.lastName || 'Nicht angegeben'}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
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
                        value={editData.street}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                       
                      />
                    ) : (
                      <div className="input-display">{profileData.street || 'Nicht angegeben'}</div>
                    )}
                  </div>
                </div>
                <div className="form-row address-row">
                  <div className="input-group">
                    <label>PLZ</label>
                    <div className="input-container">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.zip}
                          onChange={(e) => handleInputChange('zip', e.target.value)}
                      
                          maxLength="5"
                        />
                      ) : (
                        <div className="input-display">{profileData.zip || 'Nicht angegeben'}</div>
                      )}
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Stadt</label>
                    <div className="input-container">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          
                        />
                      ) : (
                        <div className="input-display">{profileData.city || 'Nicht angegeben'}</div>
                      )}
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Bundesland</label>
                    <div className="input-container">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          
                        />
                      ) : (
                        <div className="input-display">{profileData.state || 'Nicht angegeben'}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Meine Exchange-Anzeigen */}
              <div className="profile-form-section">
                <h2 className="section-title">Meine Exchange-Anzeigen</h2>
                
                {loadingPosts ? (
                  <div className="loading-spinner">Lade Anzeigen...</div>
                ) : myExchangePosts.length === 0 ? (
                  <div className="no-posts">
                    <p>Sie haben noch keine Exchange-Anzeigen erstellt.</p>
                    <button 
                      className="btn btn-edit"
                      onClick={() => window.location.href = '/exchange'}
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
                              onChange={(e) => handleStatusChange(post._id, e.target.value)}
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
            </div>
          </div>
        </div>

        {/* Edit Post Modal */}
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
                    onChange={(e) => setEditingPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titel der Anzeige"
                  />
                </div>
                <div className="input-group">
                  <label>Beschreibung</label>
                  <textarea
                    value={editingPost.description}
                    onChange={(e) => setEditingPost(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Beschreibung der Anzeige"
                  />
                </div>
                <div className="input-group">
                  <label>Status</label>
                  <select
                    value={editingPost.status}
                    onChange={(e) => setEditingPost(prev => ({ ...prev, status: e.target.value }))}
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
    </div>
  );
};

export default Profile;