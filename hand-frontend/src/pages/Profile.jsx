import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  // editData erst initialisieren, wenn Bearbeiten gestartet wird!
  const [editData, setEditData] = useState(null);

  // Erst prüfen, ob user und addresses existieren, bevor darauf zugegriffen wird!
  if (!user || !user.addresses) {
    return <div>Lade Profil...</div>;
  }
  const profileData = user;
  const hauptAdresse = profileData.addresses && profileData.addresses[0];

  // if (!profileData)
  //   return 
  //     <div> Lade Profil...</div>
  // const [profileData, setProfileData] = useState({
  //   username: 'max_mustermann',
  //   email: 'max.mustermann@email.com',
  //   password: '••••••••••',
  //   firstName: 'Max',
  //   lastName: 'Mustermann',
  //   profileImage: null,
  //   addresses: [
  //     {
  //       id: 1,
  //       type: 'Hauptadresse',
  //       district: 'München Nord',
  //       city: 'München',
  //       zip: '80331',
  //       street: 'Musterstraße 123',
  //       isPrimary: true
  //     }
  //   ]
  // });

  // const [editData, setEditData] = useState({ ...profileData, addresses: [...profileData.addresses] });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ 
      ...profileData, 
      addresses: profileData.addresses.map(addr => ({ ...addr }))
    });
  };

  const handleSave = () => {
    // Hier würdest du speichern, z.B. API-Call
    setIsEditing(false);
    setEditData(null);
  };

  // const handleSave = () => {
  //   setProfileData({ 
  //     ...editData, 
  //     addresses: editData.addresses.map(addr => ({ ...addr }))
  //   });
  //   setIsEditing(false);
  // };

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
                  {isEditing ? editData.firstName : profileData.firstName} {isEditing ? editData.lastName : profileData.lastName}
                </h2>
                <p className="profile-username">
                  @{isEditing 
                  ? (editData.username || editData.nickname)
                  : (profileData.nickname || profileData.username)
                }
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
                          value={editData.username || editData.nickname}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                        />
                      ) : (
                        <div className="input-display">{profileData.username || profileData.nickname}</div>
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
              {/*
                Anzeige von Vorname und Nachname aus der Hauptadresse (addresses[0])
                Diese Felder werden im Adress-Objekt gespeichert und nicht auf oberster Ebene des Users.
                Das sorgt für Datenschutz und Flexibilität bei mehreren Adressen.
              */}
              <div className="form-group">
                <h3 className="section-title">Persönliche Daten</h3>
                <div className="form-row">
                  <div className="input-group">
                    <label>Vorname</label>
                    <div className="input-container">
                      <div className="input-display">{hauptAdresse?.firstName || '—'}</div>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Nachname</label>
                    <div className="input-container">
                      <div className="input-display">{hauptAdresse?.lastName || '—'}</div>
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