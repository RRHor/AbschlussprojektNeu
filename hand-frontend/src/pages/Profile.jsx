
import { useState, useEffect } from 'react';
import './Profile.css';
import { API_URL } from '../config';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nickname: '',
    email: '',
    password: '••••••••••',
    firstName: '',
    lastName: '',
    district: '',
    city: '',
    zipCode: '',
    street: '',
    profileImage: null
  });
  const [editData, setEditData] = useState({ ...profileData });
  const [isLoading, setIsLoading] = useState(true);

  // Lade User-Daten beim Komponenten-Start
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        const response = await fetch(`${API_URL}/auth/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const userData = await response.json();
          const formattedData = {
            nickname: userData.nickname || '',
            email: userData.email || '',
            password: '••••••••••',
            firstName: userData.adress?.[0]?.firstName || '',
            lastName: userData.adress?.[0]?.lastName || '',
            district: userData.adress?.[0]?.district || '',
            city: userData.adress?.[0]?.city || '',
            zipCode: userData.adress?.[0]?.zipCode || '',
            street: userData.adress?.[0]?.street || '',
            profileImage: userData.profileImage || null
          };
          setProfileData(formattedData);
          setEditData(formattedData);
        } else {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Fehler beim Laden der User-Daten:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nickname: editData.nickname,
          email: editData.email,
          adress: [{
            firstName: editData.firstName,
            lastName: editData.lastName,
            street: editData.street,
            city: editData.city,
            district: editData.district,
            zipCode: parseInt(editData.zipCode, 10)
          }]
        })
      });
      if (response.ok) {
        setProfileData({ ...editData });
        setIsEditing(false);
        alert('Profil erfolgreich aktualisiert!');
      } else {
        alert('Fehler beim Speichern der Änderungen');
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Verbindungsfehler');
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
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

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="loading">Lade Profildaten...</div>
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
                  @{isEditing ? editData.nickname : profileData.nickname}
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
                          value={editData.nickname}
                          onChange={(e) => handleInputChange('nickname', e.target.value)}
                        />
                      ) : (
                        <div className="input-display">{profileData.nickname}</div>
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
                    <span className="input-icon">🔒</span>
                    {isEditing ? (
                      <input
                        type="password"
                        value={editData.password || ''}
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
                <h3 className="section-title">Adresse</h3>
                <div className="input-group">
                  <label>Straße & Hausnummer </label>
                  <div className="input-container">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.street}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                      />
                    ) : (
                      <div className="input-display">{profileData.street}</div>
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
                        />
                      ) : (
                        <div className="input-display">{profileData.zipCode}</div>
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
                        <div className="input-display">{profileData.city}</div>
                      )}
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Ortsteil</label>
                    <div className="input-container">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.district}
                          onChange={(e) => handleInputChange('district', e.target.value)}
                        />
                      ) : (
                        <div className="input-display">{profileData.district}</div>
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


// import { useState, useEffect } from 'react';
// import './Profile.css';
// import { API_URL } from '../config';

// const Profile = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileData, setProfileData] = useState({
//     nickname: '',
//     email: '',
//     password: '••••••••••',
//     firstName: '',
//     lastName: '',
//     district: '',
//     city: '',
//     zipCode: '',
//     street: '',
//     profileImage: null
//   });
//   const [editData, setEditData] = useState({ ...profileData });
//   const [isLoading, setIsLoading] = useState(true);

//   // Lade User-Daten beim Komponenten-Start
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
//         if (!token) {
//           window.location.href = '/login';
//           return;
//         }

//         const response = await fetch(`${API_URL}/auth/users/me`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         if (response.ok) {
//           const userData = await response.json();
//           const formattedData = {
//             nickname: userData.nickname || '',
//             email: userData.email || '',
//             password: '••••••••••',
//             firstName: userData.adress?.[0]?.firstName || '',
//             lastName: userData.adress?.[0]?.lastName || '',
//             district: userData.adress?.[0]?.district || '',
//             city: userData.adress?.[0]?.city || '',
//             zipCode: userData.adress?.[0]?.zipCode || '',
//             street: userData.adress?.[0]?.street || '',
//             profileImage: userData.profileImage || null
//           };
//           setProfileData(formattedData);
//           setEditData(formattedData);
//         } else {
//           // Token ungültig, zur Login-Seite weiterleiten
//           localStorage.removeItem('token');
//           sessionStorage.removeItem('token');
//           window.location.href = '/login';
//         }
//       } catch (error) {
//         console.error('Fehler beim Laden der User-Daten:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUserData();

//   }, []);

//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditData({ ...profileData });
//   };


//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
//       const response = await fetch(`${API_URL}/auth/users/me`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           nickname: editData.nickname,
//           email: editData.email,
//           adress: [{
//             firstName: editData.firstName,
//             lastName: editData.lastName,
//             street: editData.street,
//             city: editData.city,
//             district: editData.district,
//             zipCode: parseInt(editData.zipCode, 10)
//           }]
//         })
//       });

//       if (response.ok) {
//         setProfileData({ ...editData });
//         setIsEditing(false);
//         alert('Profil erfolgreich aktualisiert!');
//       } else {
//         alert('Fehler beim Speichern der Änderungen');
//       }
//     } catch (error) {
//       console.error('Fehler beim Speichern:', error);
//       alert('Verbindungsfehler');
//     }
//   };


//   const handleCancel = () => {
//     setEditData({ ...profileData });
//     setIsEditing(false);
//   };


//   // Für verschachtelte Adressfelder
//   // const handleAdressChange = (field, value) => {
//   //   setEditData(prev => ({
//   //     ...prev,
//   //     adress: {
//   //       ...prev.adress,
//   //       [field]: value
//   //     }
//   //   }));
//   // };

//   // const handleInputChange = (field, value) => {
//   //   setEditData(prev => ({
//   //     ...prev,
//   //     [field]: value
//   //   }));

//   const handleInputChange = (field, value) => {
//     setEditData(prev => ({ ...prev, [field]: value }));

//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (isEditing) {
//           setEditData(prev => ({ ...prev, profileImage: e.target.result }));
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };


//   // Ladeanzeige, solange keine Daten da sind
//   // if (!profileData) {
//   //   return <div>Lade Profil...</div>;

//   if (isLoading) {
//     return (
//       <div className="profile-container">
//         <div className="loading">Lade Profildaten...</div>
//       </div>
//     );

//   }

//   return (
//     <div className="profile-container">
//       <div className="profile-wrapper">
//         {/* Header */}
//         <div className="profile-header">
//           <div className="header-content">
//             <div className="header-text">
//               <h1>Mein Profil</h1>
//               <p>Verwalten Sie Ihre persönlichen Daten</p>
//             </div>
//             <div className="header-buttons">
//               {!isEditing ? (
//                 <button onClick={handleEdit} className="btn btn-edit">
//                   <span className="btn-icon"></span>
//                   Bearbeiten
//                 </button>
//               ) : (
//                 <div className="btn-group">
//                   <button onClick={handleSave} className="btn btn-save">
//                     <span className="btn-icon"></span>
//                     Speichern
//                   </button>
//                   <button onClick={handleCancel} className="btn btn-cancel">
//                     <span className="btn-icon"></span>
//                     Abbrechen
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="profile-content">
//           <div className="profile-grid">
//             {/* Profile Image Section */}
//             <div className="profile-image-section">
//               <div className="image-container">
//                 <div className="profile-image">
//                   {(isEditing ? editData.profileImage : profileData.profileImage) ? (
//                     <img 
//                       src={isEditing ? editData.profileImage : profileData.profileImage} 
//                       alt="Profilbild" 
//                     />
//                   ) : (
//                     <div className="default-avatar">👤</div>
//                   )}
//                   {isEditing && (
//                     <label className="image-upload-btn">
//                       <span className="upload-icon">📷</span>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                         style={{ display: 'none' }}
//                       />
//                     </label>
//                   )}
//                 </div>
//                 <h2 className="profile-name">

//                 {/* //   {isEditing ? editData.adress?.firstName : profileData.adress?.firstName} {isEditing ? editData.adress?.lastName : profileData.adress?.lastName}
//                 // </h2>
//                 // <p className="profile-nickname">
//                 //   @{isEditing ? editData.nickname : profileData.nickname} */}

//                   {isEditing ? editData.firstName : profileData.firstName} {isEditing ? editData.lastName : profileData.lastName}
//                 </h2>
//                 <p className="profile-username">
//                   @{isEditing ? editData.nickname : profileData.nickname}

//                 </p>
//               </div>
//             </div>

//             {/* Form Section */}
//             <div className="profile-form-section">
//               {/* Account Information */}
//               <div className="form-group">
//                 <h3 className="section-title">Account Informationen</h3>
//                 <div className="form-row">
//                   <div className="input-group">
//                     <label>Benutzername</label>
//                     <div className="input-container">
//                       {isEditing ? (
//                         <input
//                           type="text"

//                           value={editData.nickname}
//                           onChange={(e) => handleInputChange('nickname', e.target.value)}
//                         />
//                       ) : (
//                         <div className="input-display">{profileData.nickname}</div>

//                       )}
//                     </div>
//                   </div>
//                   <div className="input-group">
//                     <label>E-Mail</label>
//                     <div className="input-container">
//                       {isEditing ? (
//                         <input
//                           type="email"
//                           value={editData.email}
//                           onChange={(e) => handleInputChange('email', e.target.value)}
//                         />
//                       ) : (
//                         <div className="input-display">{profileData.email}</div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="input-group">
//                   <label>Passwort</label>
//                   <div className="input-container">
//                     <span className="input-icon">🔒</span>

//                     {isEditing ? (
//                       <input
//                         type="password"
//                         value={editData.password || ''}

//                         onChange={(e) => handleInputChange('password', e.target.value)}
//                       />
//                     ) : (
//                       <div className="input-display">••••••••••</div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Personal Information */}
//               <div className="form-group">
//                 <h3 className="section-title">Persönliche Daten</h3>
//                 <div className="form-row">
//                   <div className="input-group">
//                     <label>Vorname</label>
//                     <div className="input-container">
//                       {isEditing ? (
//                         <input
//                           type="text"

//                           value={editData.adress?.firstName || ''}
//                           onChange={(e) => handleAdressChange('firstName', e.target.value)}
//                         />
//                       ) : (
//                         <div className="input-display">{profileData.adress?.firstName}</div>

//                       )}
//                     </div>
//                   </div>
//                   <div className="input-group">
//                     <label>Nachname</label>
//                     <div className="input-container">
//                       {isEditing ? (
//                         <input
//                           type="text"

//                           value={editData.adress?.lastName || ''}
//                           onChange={(e) => handleAdressChange('lastName', e.target.value)}
//                         />
//                       ) : (
//                         <div className="input-display">{profileData.adress?.lastName}</div>

//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Address Information */}
//               <div className="form-group">
//                 <h3 className="section-title">Adresse</h3>
//                 <div className="input-group">

//                   <label>Straße & Hausnummer </label>

//                   <div className="input-container">
//                     {isEditing ? (
//                       <input
//                         type="text"

//                         value={editData.adress?.street || ''}
//                         onChange={(e) => handleAdressChange('street', e.target.value)}
//                       />
//                     ) : (
//                       <div className="input-display">{profileData.adress?.street}</div>

//                     )}
//                   </div>
//                 </div>
//                 <div className="form-row address-row">
//                   <div className="input-group">
//                     <label>PLZ</label>
//                     <div className="input-container">
//                       {isEditing ? (
//                         <input
//                           type="text"

//                           value={editData.adress?.zipCode || ''}
//                           onChange={(e) => handleAdressChange('zipCode', e.target.value)}
//                         />
//                       ) : (
//                         <div className="input-display">{profileData.adress?.zipCode}</div>

//                       )}
//                     </div>
//                   </div>
//                   <div className="input-group">
//                     <label>Stadt</label>
//                     <div className="input-container">
//                       {isEditing ? (
//                         <input
//                           type="text"

//                           value={editData.adress?.city || ''}
//                           onChange={(e) => handleAdressChange('city', e.target.value)}
//                         />
//                       ) : (
//                         <div className="input-display">{profileData.adress?.city}</div>

//                       )}
//                     </div>
//                   </div>
//                   <div className="input-group">

//                     <label>Ortsteil</label>

//                     <div className="input-container">
//                       {isEditing ? (
//                         <input
//                           type="text"

//                           value={editData.adress?.district || ''}
//                           onChange={(e) => handleAdressChange('district', e.target.value)}
//                         />
//                       ) : (
//                         <div className="input-display">{profileData.adress?.district}</div>

//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default Profile;

