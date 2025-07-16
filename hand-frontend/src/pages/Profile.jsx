import { useState, useEffect } from 'react';
// NEU: AuthContext importieren
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Edit3, Save, X, Camera, Loader, Calendar, Users } from 'lucide-react';
import api from '../api';
import exchangeService from '../services/exchangeService';
import './Profile.css';
import Footer from '../components/Footer';


const Profile = () => {

  // User und Ladezustand aus dem Context holen
  const { user, loading } = useAuth();


const Profile = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  console.log('User im Profil:', user);


  // === NEU: Ladeanzeige und Fallback ===
  if (loading) {
    return <div>Profil wird geladen...</div>;
  }
  if (!user) {
    return <div>Kein Benutzer gefunden. Bitte einloggen!</div>;
  }
  // === ENDE NEU ===

  // const [isEditing, setIsEditing] = useState(false);
  // const [profileData, setProfileData] = useState({
  //   username: 'max_mustermann',
  //   email: 'max.mustermann@email.com',
  //   password: '••••••••••',
  //   firstName: 'Max',
  //   lastName: 'Mustermann',
  //   profileImage: null,
  //   addresses: [
    //   {
    //     id: 1,
    //     type: 'Hauptadresse',
    //     district: 'München Nord',
    //     city: 'München',
    //     zip: '80331',
    //     street: 'Musterstraße 123',
    //     isPrimary: true
    //   }
    // ]
  // });

  // Hauptadresse auslesen
  const hauptAdresse = user?.addresses?.find(addr => addr.isPrimary) || user?.addresses?.[0] || {};

  // NEU: Initialisiere mit echten Userdaten (wenn vorhanden)
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(user ? {
    username: user.nickname || user.username || '',
    email: user.email || '',
    password: '••••••••••',
    firstName: hauptAdresse.firstName || '',
    lastName: hauptAdresse.lastName || '',
    profileImage: null,
    addresses: user.addresses || []
  } : {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    profileImage: null,
    addresses: []
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
    if (!authLoading && currentUser) fetchUserData();
  }, [currentUser, authLoading]);



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
    if (activeTab === 'events' && currentUser) loadUserEvents();
    // eslint-disable-next-line
  }, [activeTab, currentUser]);

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
                          value={editData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                      ) : (
                        <div className="input-display">{profileData.firstName}</div>
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
                        <div className="input-display">{profileData.lastName}</div>
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
                              🗑️
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