import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Edit3, Save, X, Camera, Loader } from 'lucide-react';
import api from '../api';
import exchangeService from '../services/exchangeService';
import './Profile.css';
import ExchangeEditModal from '../components/ExchangeEditModal';
import Footer from '../components/Footer';

const emptyAddress = {
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  district: '',
  zipCode: ''
};

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nickname: '',
    email: '',
    firstName: '',
    lastName: '',
    district: '',
    city: '',
    zipCode: '',
    street: '',
    state: '',
    password: '••••••••••',
    addresses: [ { ...emptyAddress } ],
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
        console.log('📦 Loading user profile data...');

        // Use api instance instead of fetch
        const response = await api.get('/auth/users/me');
        
        const userData = response.data;
        console.log('✅ User data loaded:', userData);
        
        const formattedData = {
          nickname: userData.nickname || '',
          email: userData.email || '',
          password: '••••••••••',
          addresses: Array.isArray(userData.addresses) && userData.addresses.length > 0
            ? userData.addresses
            : [ { ...emptyAddress } ],
          profileImage: userData.profileImage || null
        };
        
        console.log('📋 Formatted Data:', formattedData);
        setProfileData(formattedData);
        setEditData(formattedData);

      } catch (error) {
        console.error('❌ Error loading user data:', error);
        
        // If 401, redirect to login
        if (error.response?.status === 401) {
          console.log('🔓 Token invalid, redirecting to login');
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        
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
      console.log('💾 Saving profile data...');
      setIsSaving(true);

      // Use api instance instead of fetch
      const response = await api.put('/auth/users/me', {
        nickname: editData.nickname,
        email: editData.email,
        addresses: editData.addresses.map(addr => ({
          firstName: addr.firstName,
          lastName: addr.lastName,
          street: addr.street,
          city: addr.city,
          district: addr.district,
          zipCode: parseInt(addr.zipCode, 10) || ''
        }))
      });

      console.log('✅ Profile saved successfully');
      setProfileData({ ...editData });
      setIsEditing(false);
      setError(null);
      alert('Profil erfolgreich aktualisiert!');

    } catch (error) {
      console.error('❌ Error saving profile:', error);
      setError('Fehler beim Speichern der Profildaten');
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


  // Für Adressänderungen
  const handleAddressChange = (idx, field, value) => {
    setEditData(prev => {
      const addresses = prev.addresses.map((addr, i) =>
        i === idx ? { ...addr, [field]: value } : addr
      );
      return { ...prev, addresses };
    });
  };

  const handleAddAddress = () => {
    setEditData(prev => ({
      ...prev,
      addresses: [ ...prev.addresses, { ...emptyAddress } ]
    }));
  };

  const handleRemoveAddress = (idx) => {
    setEditData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== idx)
    }));
  };

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
                  <div>
                  <button onClick={handleEdit} className="btn btn-edit">
                    <Edit3 size={18} />
                    Bearbeiten
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
              ):null}
              </div>
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
                          value={editData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          maxLength="5"
                        />
                      ) : (
                        <div className="input-display">{profileData.zipCode || 'Nicht angegeben'}</div>
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

                    {isEditing
                      ? editData.addresses[0]?.firstName + ' ' + editData.addresses[0]?.lastName
                      : profileData.addresses[0]?.firstName + ' ' + profileData.addresses[0]?.lastName}

                  </h2>
                  <p className="profile-username">
                    @{profileData.nickname || 'unbekannt'}
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
                            value={editData.nickname}
                            onChange={(e) => handleInputChange('nickname', e.target.value)}
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
                            onChange={(e) => handleInputChange('email', e.target.value)}
                          />
                        ) : (
                          <div className="input-display">{profileData.email || 'Nicht angegeben'}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information (Mehrere Adressen) */}
                <div className="form-group">

                  <h3 className="section-title">Adressen</h3>
                  {editData.addresses.map((address, idx) => (
                    <div key={idx} className="address-block">
                      <div className="form-row">
                        <div className="input-group">
                          <label>Vorname</label>
                          <div className="input-container">
                            {isEditing ? (
                              <input
                                type="text"
                                value={address.firstName}
                                onChange={e => handleAddressChange(idx, 'firstName', e.target.value)}
                              />
                            ) : (
                              <div className="input-display">{address.firstName}</div>
                            )}
                          </div>
                        </div>
                        <div className="input-group">
                          <label>Nachname</label>
                          <div className="input-container">
                            {isEditing ? (
                              <input
                                type="text"
                                value={address.lastName}
                                onChange={e => handleAddressChange(idx, 'lastName', e.target.value)}
                              />
                            ) : (
                              <div className="input-display">{address.lastName}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="input-group">
                        <label>Straße & Hausnummer</label>
                        <div className="input-container">
                          {isEditing ? (
                            <input
                              type="text"
                              value={address.street}
                              onChange={e => handleAddressChange(idx, 'street', e.target.value)}
                            />
                          ) : (
                            <div className="input-display">{address.street}</div>
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
                                value={address.zipCode}
                                onChange={e => handleAddressChange(idx, 'zipCode', e.target.value)}
                              />
                            ) : (
                              <div className="input-display">{address.zipCode}</div>
                            )}
                          </div>
                        </div>
                        <div className="input-group">
                          <label>Stadt</label>
                          <div className="input-container">
                            {isEditing ? (
                              <input
                                type="text"
                                value={address.city}
                                onChange={e => handleAddressChange(idx, 'city', e.target.value)}
                              />
                            ) : (
                              <div className="input-display">{address.city}</div>
                            )}
                          </div>
                        </div>
                        <div className="input-group">
                          <label>Ortsteil</label>
                          <div className="input-container">
                            {isEditing ? (
                              <input
                                type="text"
                                value={address.district}
                                onChange={e => handleAddressChange(idx, 'district', e.target.value)}
                              />
                            ) : (
                              <div className="input-display">{address.district}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="input-group">
                        <label>Typ (optional)</label>
                        <div className="input-container">
                          {isEditing ? (
                            <input
                              type="text"
                              value={address.type || ''}
                              onChange={e => handleAddressChange(idx, 'type', e.target.value)}
                            />
                          ) : (
                            <div className="input-display">{address.type || '-'}</div>
                          )}
                        </div>
                      </div>
                      <div className="input-group">
                        <label>Hauptadresse</label>
                        <div className="input-container">
                          {isEditing ? (
                            <input
                              type="checkbox"
                              checked={!!address.isPrimary}
                              onChange={e => handleAddressChange(idx, 'isPrimary', e.target.checked)}
                            />
                          ) : (
                            <div className="input-display">{address.isPrimary ? 'Ja' : 'Nein'}</div>
                          )}
                        </div>
                      </div>
                      {isEditing && editData.addresses.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-remove-address"
                          onClick={() => handleRemoveAddress(idx)}
                        >
                          Adresse entfernen
                        </button>

                      )}
                      <hr />
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      type="button"
                      className="btn btn-add-address"
                      onClick={handleAddAddress}
                    >
                      + Adresse hinzufügen
                    </button>
                  )}

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
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Profile;


