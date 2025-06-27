import { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);

  // Lade Userdaten nach dem Rendern
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:4000/api/users/me', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => res.json())
      .then(data => {
        setProfileData(data);
        setEditData(data);
      });
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  // const handleSave = () => {
  //   setProfileData({ ...editData });
  //   setIsEditing(false);
  //   // Optional: Hier könntest du ein Update an dein Backend schicken
  // };

  const handleSave = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('http://localhost:4000/api/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(editData),
    });
    if (response.ok) {
      const updated = await response.json();
      setProfileData(updated);
      setIsEditing(false);
    } else {
      alert('Fehler beim Speichern!');
    }
  } catch (error) {
    alert('Serverfehler beim Speichern!');
  }
};

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  // Für verschachtelte Adressfelder
  const handleAdressChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      adress: {
        ...prev.adress,
        [field]: value
      }
    }));
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
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

  // Ladeanzeige, solange keine Daten da sind
  if (!profileData) {
    return <div>Lade Profil...</div>;
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
                  {isEditing ? editData.adress?.firstName : profileData.adress?.firstName} {isEditing ? editData.adress?.lastName : profileData.adress?.lastName}
                </h2>
                <p className="profile-nickname">
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
                          value={editData.adress?.firstName || ''}
                          onChange={(e) => handleAdressChange('firstName', e.target.value)}
                        />
                      ) : (
                        <div className="input-display">{profileData.adress?.firstName}</div>
                      )}
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Nachname</label>
                    <div className="input-container">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.adress?.lastName || ''}
                          onChange={(e) => handleAdressChange('lastName', e.target.value)}
                        />
                      ) : (
                        <div className="input-display">{profileData.adress?.lastName}</div>
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
                        value={editData.adress?.street || ''}
                        onChange={(e) => handleAdressChange('street', e.target.value)}
                      />
                    ) : (
                      <div className="input-display">{profileData.adress?.street}</div>
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
                          value={editData.adress?.zipCode || ''}
                          onChange={(e) => handleAdressChange('zipCode', e.target.value)}
                        />
                      ) : (
                        <div className="input-display">{profileData.adress?.zipCode}</div>
                      )}
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Stadt</label>
                    <div className="input-container">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.adress?.city || ''}
                          onChange={(e) => handleAdressChange('city', e.target.value)}
                        />
                      ) : (
                        <div className="input-display">{profileData.adress?.city}</div>
                      )}
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Ortsteil</label>
                    <div className="input-container">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.adress?.district || ''}
                          onChange={(e) => handleAdressChange('district', e.target.value)}
                        />
                      ) : (
                        <div className="input-display">{profileData.adress?.district}</div>
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

// const Profile = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileData, setProfileData] = useState(null);
//   const [editData, setEditData] = useState(null);

//   // Lade Userdaten nach dem Rendern
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     fetch('http://localhost:4000/api/users/me', {
//       headers: {
//         Authorization: 'Bearer ' + token
//       }
//     })
//       .then(res => res.json())
//       .then(data => {
//         setProfileData(data);
//         setEditData(data);
//       });
//   }, []);

//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditData({ ...profileData });
//   };

//   const handleSave = () => {
//     setProfileData({ ...editData });
//     setIsEditing(false);
//     // Optional: Hier könntest du ein Update an dein Backend schicken
//   };

//   const handleCancel = () => {
//     setEditData({ ...profileData });
//     setIsEditing(false);
//   };

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
//   if (!profileData) {
//     return <div>Lade Profil...</div>;
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
//                   {isEditing ? editData.adress.firstName : profileData.adress.firstName} {isEditing ? editData.adress.lastName : profileData.adress.lastName}
//                 </h2>
//                 <p className="profile-nickname">
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
//                           value={editData.adress.firstName}
//                           onChange={(e) => handleInputChange('firstName', e.target.value)}
//                         />
//                       ) : (
//                         <div className="input-display">{profileData.adress.firstName}</div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="input-group">
//                     <label>Nachname</label>
//                     <div className="input-container">
//                       {isEditing ? (
//                         <input
//                           type="text"
//                           value={editData.adress.lastName}
//                           onChange={(e) => handleInputChange('lastName', e.target.value)}
//                         />
//                       ) : (
//                         <div className="input-display">{profileData.adress.lastName}</div>
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
//                         value={editData.street}
//                         onChange={(e) => handleInputChange('street', e.target.value)}
//                       />
//                     ) : (
//                       <div className="input-display">{profileData.street}</div>
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
//                           value={editData.zip}
//                           onChange={(e) => handleInputChange('zip', e.target.value)}
//                         />
//                       ) : (
//                         <div className="input-display">{profileData.zip}</div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="input-group">
//                     <label>Stadt</label>
//                     <div className="input-container">
//                       {isEditing ? (
//                         <input
//                           type="text"
//                           value={editData.city}
//                           onChange={(e) => handleInputChange('city', e.target.value)}
//                         />
//                       ) : (
//                         <div className="input-display">{profileData.city}</div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="input-group">
//                     <label>Ortsteil</label>
//                     <div className="input-container">
//                       {isEditing ? (
//                         <input
//                           type="text"
//                           value={editData.district}
//                           onChange={(e) => handleInputChange('district', e.target.value)}
//                         />
//                       ) : (
//                         <div className="input-display">{profileData.district}</div>
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


// // import { useState } from 'react';
// // import './Profile.css';

// // const Profile = () => {
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [profileData, setProfileData] = useState({
// //     username: ' ',
// //     email: ' ',
// //     password: ' ',
// //     firstName: ' ',
// //     lastName: ' ',
// //     district: ' ',
// //     city: ' ',
// //     zip: ' ',
// //     street: ' ',
// //     profileImage: null
// //   });

// //   const [editData, setEditData] = useState({ ...profileData });

// //   const handleEdit = () => {
// //     setIsEditing(true);
// //     setEditData({ ...profileData });
// //   };

// //   const handleSave = () => {
// //     setProfileData({ ...editData });
// //     setIsEditing(false);
// //   };

// //   const handleCancel = () => {
// //     setEditData({ ...profileData });
// //     setIsEditing(false);
// //   };

// //   const handleInputChange = (field, value) => {
// //     setEditData(prev => ({ ...prev, [field]: value }));
// //   };

// //   const handleImageUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       const reader = new FileReader();
// //       reader.onload = (e) => {
// //         if (isEditing) {
// //           setEditData(prev => ({ ...prev, profileImage: e.target.result }));
// //         }
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   return (
// //     <div className="profile-container">
// //       <div className="profile-wrapper">
// //         {/* Header */}
// //         <div className="profile-header">
// //           <div className="header-content">
// //             <div className="header-text">
// //               <h1>Mein Profil</h1>
// //               <p>Verwalten Sie Ihre persönlichen Daten</p>
// //             </div>
// //             <div className="header-buttons">
// //               {!isEditing ? (
// //                 <button onClick={handleEdit} className="btn btn-edit">
// //                   <span className="btn-icon"></span>
// //                   Bearbeiten
// //                 </button>
// //               ) : (
// //                 <div className="btn-group">
// //                   <button onClick={handleSave} className="btn btn-save">
// //                     <span className="btn-icon"></span>
// //                     Speichern
// //                   </button>
// //                   <button onClick={handleCancel} className="btn btn-cancel">
// //                     <span className="btn-icon"></span>
// //                     Abbrechen
// //                   </button>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Main Content */}
// //         <div className="profile-content">
// //           <div className="profile-grid">
// //             {/* Profile Image Section */}
// //             <div className="profile-image-section">
// //               <div className="image-container">
// //                 <div className="profile-image">
// //                   {(isEditing ? editData.profileImage : profileData.profileImage) ? (
// //                     <img 
// //                       src={isEditing ? editData.profileImage : profileData.profileImage} 
// //                       alt="Profilbild" 
// //                     />
// //                   ) : (
// //                     <div className="default-avatar">👤</div>
// //                   )}
// //                   {isEditing && (
// //                     <label className="image-upload-btn">
// //                       <span className="upload-icon">📷</span>
// //                       <input
// //                         type="file"
// //                         accept="image/*"
// //                         onChange={handleImageUpload}
// //                         style={{ display: 'none' }}
// //                       />
// //                     </label>
// //                   )}
// //                 </div>
// //                 <h2 className="profile-name">
// //                   {isEditing ? editData.firstName : profileData.firstName} {isEditing ? editData.lastName : profileData.lastName}
// //                 </h2>
// //                 <p className="profile-nickname">
// //                   @{isEditing ? editData.nickname : profileData.nickname}
// //                 </p>
// //               </div>
// //             </div>

// //             {/* Form Section */}
// //             <div className="profile-form-section">
// //               {/* Account Information */}
// //               <div className="form-group">
// //                 <h3 className="section-title">Account Informationen</h3>
// //                 <div className="form-row">
// //                   <div className="input-group">
// //                     <label>Benutzername</label>
// //                     <div className="input-container">
// //                       {isEditing ? (
// //                         <input
// //                           type="text"
// //                           value={editData.nickname}
// //                           onChange={(e) => handleInputChange('nickname', e.target.value)}
// //                         />
// //                       ) : (
// //                         <div className="input-display">{profileData.nickname}</div>
// //                       )}
// //                     </div>
// //                   </div>
// //                   <div className="input-group">
// //                     <label>E-Mail</label>
// //                     <div className="input-container">
// //                       {isEditing ? (
// //                         <input
// //                           type="email"
// //                           value={editData.email}
// //                           onChange={(e) => handleInputChange('email', e.target.value)}
// //                         />
// //                       ) : (
// //                         <div className="input-display">{profileData.email}</div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <div className="input-group">
// //                   <label>Passwort</label>
// //                   <div className="input-container">
// //                     {isEditing ? (
// //                       <input
// //                         type="password"
// //                         value={editData.password}
// //                         onChange={(e) => handleInputChange('password', e.target.value)}
// //                       />
// //                     ) : (
// //                       <div className="input-display">••••••••••</div>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Personal Information */}
// //               <div className="form-group">
// //                 <h3 className="section-title">Persönliche Daten</h3>
// //                 <div className="form-row">
// //                   <div className="input-group">
// //                     <label>Vorname</label>
// //                     <div className="input-container">
// //                       {isEditing ? (
// //                         <input
// //                           type="text"
// //                           value={editData.firstName}
// //                           onChange={(e) => handleInputChange('firstName', e.target.value)}
// //                         />
// //                       ) : (
// //                         <div className="input-display">{profileData.firstName}</div>
// //                       )}
// //                     </div>
// //                   </div>
// //                   <div className="input-group">
// //                     <label>Nachname</label>
// //                     <div className="input-container">
// //                       {isEditing ? (
// //                         <input
// //                           type="text"
// //                           value={editData.lastName}
// //                           onChange={(e) => handleInputChange('lastName', e.target.value)}
// //                         />
// //                       ) : (
// //                         <div className="input-display">{profileData.lastName}</div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Address Information */}
// //               <div className="form-group">
// //                 <h3 className="section-title">Adresse</h3>
// //                 <div className="input-group">
// //                   <label>Straße & Hausnummer </label>
// //                   <div className="input-container">
// //                     {isEditing ? (
// //                       <input
// //                         type="text"
// //                         value={editData.street}
// //                         onChange={(e) => handleInputChange('street', e.target.value)}
// //                       />
// //                     ) : (
// //                       <div className="input-display">{profileData.street}</div>
// //                     )}
// //                   </div>
// //                 </div>
// //                 <div className="form-row address-row">
// //                   <div className="input-group">
// //                     <label>PLZ</label>
// //                     <div className="input-container">
// //                       {isEditing ? (
// //                         <input
// //                           type="text"
// //                           value={editData.zipCode}
// //                           onChange={(e) => handleInputChange('zipCode', e.target.value)}
// //                         />
// //                       ) : (
// //                         <div className="input-display">{profileData.zipCode}</div>
// //                       )}
// //                     </div>
// //                   </div>
// //                   <div className="input-group">
// //                     <label>Stadt</label>
// //                     <div className="input-container">
// //                       {isEditing ? (
// //                         <input
// //                           type="text"
// //                           value={editData.city}
// //                           onChange={(e) => handleInputChange('city', e.target.value)}
// //                         />
// //                       ) : (
// //                         <div className="input-display">{profileData.city}</div>
// //                       )}
// //                     </div>
// //                   </div>
// //                   <div className="input-group">
// //                     <label>Ortsteil</label>
// //                     <div className="input-container">
// //                       {isEditing ? (
// //                         <input
// //                           type="text"
// //                           value={editData.district}
// //                           onChange={(e) => handleInputChange('district', e.target.value)}
// //                         />
// //                       ) : (
// //                         <div className="input-display">{profileData.district}</div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Profile;