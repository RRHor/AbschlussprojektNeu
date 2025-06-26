import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, MapPin, Edit3, Save, X, Camera, Loader } from 'lucide-react';
import api from '../api';
import './Profile.css';

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

  // User-Daten laden
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/users/me');
        
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updateData = {
        nickname: editData.username,
        email: editData.email,
      };

      // Nur Adresse hinzufügen, wenn Daten vorhanden
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

      const response = await api.put('/users/me', updateData);
      
      if (response.status === 200) {
        setProfileData({ ...editData });
        setIsEditing(false);
        setError(null);
        // Optional: Toast-Notification statt Alert
        alert('Profil erfolgreich aktualisiert!');
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
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
                          placeholder="Benutzername eingeben"
                        />
                      ) : (
                        <div className="input-display">{profileData.username || 'Nicht angegeben'}</div>
                      )}
                    </div>
                  </div>
                  <div className="input-group">
                    <label>E-Mail</label>
                    <div className="input-container">
                      <Mail size={16} className="input-icon" />
                      {isEditing ? (
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="E-Mail eingeben"
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
                          placeholder="Vorname eingeben"
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
                          placeholder="Nachname eingeben"
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
                  <label>Straße</label>
                  <div className="input-container">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.street}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        placeholder="Straße und Hausnummer"
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
                          placeholder="PLZ"
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
                          placeholder="Stadt"
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
                          placeholder="Bundesland"
                        />
                      ) : (
                        <div className="input-display">{profileData.state || 'Nicht angegeben'}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;