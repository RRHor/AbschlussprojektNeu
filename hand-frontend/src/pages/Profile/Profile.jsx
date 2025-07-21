import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const API_URL = import.meta.env.VITE_API_URL;

const emptyAddress = {
  id: Date.now(),
  type: 'Hauptadresse',
  district: '',
  city: '',
  zip: '',
  street: '',
  isPrimary: true
};

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    password: '',
    profileImage: null,
    addresses: []
  });
  const [editData, setEditData] = useState({ ...profileData });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/auth/users/me`);
        const data = response.data;
        setProfileData({
          username: data.nickname || data.username || '',
          email: data.email || '',
          password: '••••••••••',
          profileImage: data.profileImage || null,
          addresses: Array.isArray(data.addresses) && data.addresses.length > 0
            ? data.addresses
            : [ { ...emptyAddress } ]
        });
        setEditData({
          username: data.nickname || data.username || '',
          email: data.email || '',
          password: '••••••••••',
          profileImage: data.profileImage || null,
          addresses: Array.isArray(data.addresses) && data.addresses.length > 0
            ? data.addresses
            : [ { ...emptyAddress } ]
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ 
      ...profileData, 
      addresses: profileData.addresses.map(addr => ({ ...addr }))
    });
  };

  const handleSave = () => {
    setProfileData({ 
      ...editData, 
      addresses: editData.addresses.map(addr => ({ ...addr }))
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ 
      ...profileData, 
      addresses: profileData.addresses.map(addr => ({ ...addr }))
    });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (addressId, field, value) => {
    setEditData(prev => ({
      ...prev,
      addresses: prev.addresses.map(addr =>
        addr.id === addressId ? { ...addr, [field]: value } : addr
      )
    }));
  };

  const addNewAddress = () => {
    const newAddress = {
      id: Date.now(),
      type: 'Weitere Adresse',
      district: '',
      city: '',
      zip: '',
      street: '',
      isPrimary: false
    };
    setEditData(prev => ({
      ...prev,
      addresses: [...prev.addresses, newAddress]
    }));
  };

  const removeAddress = (addressId) => {
    setEditData(prev => ({
      ...prev,
      addresses: prev.addresses.filter(addr => addr.id !== addressId)
    }));
  };

  const setPrimaryAddress = (addressId) => {
    setEditData(prev => ({
      ...prev,
      addresses: prev.addresses.map(addr => ({
        ...addr,
        isPrimary: addr.id === addressId,
        type: addr.id === addressId ? 'Hauptadresse' : 
              addr.type === 'Hauptadresse' ? 'Weitere Adresse' : addr.type
      }))
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isEditing) {
          setEditData(prev => ({ ...prev, profileImage: e.target.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currentAddresses = isEditing ? editData.addresses : profileData.addresses;

  if (isLoading || authLoading) {
    return <div>Profil wird geladen...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (!user) {
    return <div>Kein Benutzer gefunden. Bitte einloggen!</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Mein Profil</h1>
              <p>Verwalten Sie Ihre persönlichen Daten</p>
            </div>
            <div className="header-buttons">
              {!isEditing ? (
                <button onClick={handleEdit} className="btn btn-edit">
                  <span className="btn-icon"></span>
                  Bearbeiten
                </button>
              ) : (
                <div className="btn-group">
                  <button onClick={handleSave} className="btn btn-save">
                    <span className="btn-icon"></span>
                    Speichern
                  </button>
                  <button onClick={handleCancel} className="btn btn-cancel">
                    <span className="btn-icon"></span>
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
                    <div className="default-avatar">👤</div>
                  )}
                  {isEditing && (
                    <label className="image-upload-btn">
                      <span className="upload-icon">📷</span>
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
                    ? (editData.addresses[0]?.firstName || '') + ' ' + (editData.addresses[0]?.lastName || '')
                    : (profileData.addresses[0]?.firstName || '') + ' ' + (profileData.addresses[0]?.lastName || '')
                  }
                </h2>
                <p className="profile-username">
                  @{isEditing ? editData.username : profileData.username}
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="profile-form-section">
              {/* Account Information */}
              <div className="form-group">
                <h3 className="section-title">Account Informationen</h3>
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
                        <div className="input-display">{profileData.username}</div>
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
                        <div className="input-display">{profileData.email}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <label>Passwort</label>
                  <div className="input-container">
                    {isEditing ? (
                      <input
                        type="password"
                        value={editData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                      />
                    ) : (
                      <div className="input-display">••••••••••</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="form-group">
                <h3 className="section-title">Persönliche Daten</h3>
                <div className="form-row">
                  <div className="input-group">
                    <label>Vorname</label>
                    <div className="input-container">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.addresses[0]?.firstName || ''}
                          onChange={e => handleAddressChange(editData.addresses[0].id, 'firstName', e.target.value)}
                        />
                      ) : (
                        <div className="input-display">{profileData.addresses[0]?.firstName || ''}</div>
                      )}
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Nachname</label>
                    <div className="input-container">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.addresses[0]?.lastName || ''}
                          onChange={e => handleAddressChange(editData.addresses[0].id, 'lastName', e.target.value)}
                        />
                      ) : (
                        <div className="input-display">{profileData.addresses[0]?.lastName || ''}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="form-group">
                <div className="addresses-header">
                  <h3 className="section-title">Adressen</h3>
                  {isEditing && (
                    <button 
                      onClick={addNewAddress}
                      className=" btn-add-address"
                      type="button"
                    >
                      <span className="btn-icon">+</span>
                      Weitere Adresse
                    </button>
                  )}
                </div>

                <div className="addresses-container">
                  {currentAddresses.map((address, index) => (
                    <div key={address.id} className="address-card">
                      <div className="address-card-header">
                        <div className="address-title-section">
                          <h4 className={`address-title ${address.isPrimary ? 'primary' : 'secondary'}`}>
                            {address.type}
                          </h4>
                          {address.isPrimary && (
                            <span className="primary-indicator">Hauptadresse</span>
                          )}
                        </div>
                        {isEditing && currentAddresses.length > 1 && (
                          <div className="address-controls">
                            {!address.isPrimary && (
                              <button
                                onClick={() => setPrimaryAddress(address.id)}
                                className="btn btn-primary-toggle"
                                type="button"
                              >
                                Als Hauptadresse
                              </button>
                            )}
                            <button
                              onClick={() => removeAddress(address.id)}
                              className="btn btn-address-remove"
                              type="button"
                              disabled={address.isPrimary}
                              title={address.isPrimary ? "Hauptadresse kann nicht gelöscht werden" : "Adresse löschen"}
                            >
                              Adresse entfernen
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="address-fields">
                        <div className="input-group">
                          <label>Straße & Hausnummer</label>
                          <div className="input-container">
                            {isEditing ? (
                              <input
                                type="text"
                                value={address.street}
                                onChange={(e) => handleAddressChange(address.id, 'street', e.target.value)}
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
                                  value={address.zip}
                                  onChange={(e) => handleAddressChange(address.id, 'zip', e.target.value)}
                                />
                              ) : (
                                <div className="input-display">{address.zip}</div>
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
                                  onChange={(e) => handleAddressChange(address.id, 'city', e.target.value)}
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
                                  onChange={(e) => handleAddressChange(address.id, 'district', e.target.value)}
                                />
                              ) : (
                                <div className="input-display">{address.district}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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