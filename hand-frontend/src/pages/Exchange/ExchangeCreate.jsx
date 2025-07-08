// // src/pages/Exchange/ExchangeCreate.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft, Upload, X } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';
// import exchangeService from '../../services/exchangeService';
// import './ExchangeCreate.css';

// const ExchangeCreate = ({ onPostCreated }) => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: 'verschenken',
//     picture: '',
//     tauschGegen: ''
//   });
  
//   const [imagePreview, setImagePreview] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
    
//     // Fehler für dieses Feld entfernen
//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: null
//       }));
//     }
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validierung
//       if (file.size > 5 * 1024 * 1024) { // 5MB
//         setErrors(prev => ({
//           ...prev,
//           picture: 'Bild darf maximal 5MB groß sein'
//         }));
//         return;
//       }

//       if (!file.type.startsWith('image/')) {
//         setErrors(prev => ({
//           ...prev,
//           picture: 'Nur Bilddateien sind erlaubt'
//         }));
//         return;
//       }

//       // Base64 konvertieren
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64String = reader.result;
//         setFormData(prev => ({
//           ...prev,
//           picture: base64String
//         }));
//         setImagePreview(base64String);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleImageUrlChange = (url) => {
//     setFormData(prev => ({
//       ...prev,
//       picture: url
//     }));
//     setImagePreview(url);
//   };

//   const removeImage = () => {
//     setFormData(prev => ({
//       ...prev,
//       picture: ''
//     }));
//     setImagePreview('');
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // Titel validieren
//     if (!formData.title.trim()) {
//       newErrors.title = 'Titel ist erforderlich';
//     } else if (formData.title.length > 100) {
//       newErrors.title = 'Titel darf maximal 100 Zeichen haben';
//     }

//     // Beschreibung validieren
//     if (!formData.description.trim()) {
//       newErrors.description = 'Beschreibung ist erforderlich';
//     } else if (formData.description.length > 1000) {
//       newErrors.description = 'Beschreibung darf maximal 1000 Zeichen haben';
//     }

//     // Kategorie validieren
//     if (!formData.category) {
//       newErrors.category = 'Kategorie ist erforderlich';
//     }

//     // BILD VALIDIERUNG ENTFERNT - Bild ist jetzt optional!
//     // if (!formData.picture) {
//     //   newErrors.picture = 'Bild ist erforderlich';
//     // }

//     // Tausch-Validierung nur wenn Kategorie "tauschen"
//     if (formData.category === 'tauschen' && !formData.tauschGegen.trim()) {
//       newErrors.tauschGegen = 'Bitte geben Sie an, wogegen Sie tauschen möchten';
//     } else if (formData.tauschGegen && formData.tauschGegen.length > 200) {
//       newErrors.tauschGegen = 'Tausch-Beschreibung darf maximal 200 Zeichen haben';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     console.log('🎯 Form submission started');
//     console.log('📝 Current formData:', formData);
//     console.log('👤 Current user:', user);
//     console.log('🎫 Token from localStorage:', localStorage.getItem('token'));
    
//     if (!validateForm()) {
//       console.log('❌ Frontend validation failed');
//       return;
//     }

//     setLoading(true);
//     try {
//       const submitData = { ...formData };
//       if (!submitData.picture || submitData.picture.trim() === '') {
//         submitData.picture = '';
//       }

//       console.log('📤 Sending to API:', submitData);

//       const result = await exchangeService.createPost(submitData);
      
//       console.log('📥 API Response received:', result);

//       if (result.success) {
//         alert('Anzeige erfolgreich erstellt!');
//         onPostCreated(result.data);
//         navigate('/exchange');
//       } else {
//         console.log('❌ API returned success: false');
//         alert('Fehler: ' + result.message);
//       }
//     } catch (error) {
//       console.error('❌ Frontend error:', error);
//       console.error('❌ Error response:', error.response?.data);
//       alert(error.message || 'Fehler beim Erstellen der Anzeige');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="exchange-create">
//       <div className="create-header">
//         <button 
//           onClick={() => navigate('/exchange')} 
//           className="back-button"
//         >
//           <ArrowLeft size={20} />
//           Zurück
//         </button>
//         <h1>Neue Anzeige erstellen</h1>
//       </div>

//       <form onSubmit={handleSubmit} className="create-form">
//         {/* Kategorie */}
//         <div className="form-section">
//           <h2>Kategorie wählen</h2>
//           <div className="category-selection">
//             <label className={`category-option ${formData.category === 'verschenken' ? 'selected' : ''}`}>
//               <input
//                 type="radio"
//                 name="category"
//                 value="verschenken"
//                 checked={formData.category === 'verschenken'}
//                 onChange={(e) => handleInputChange('category', e.target.value)}
//               />
//               <div className="category-card">
//                 <div className="category-icon">🎁</div>
//                 <h3>Verschenken</h3>
//                 <p>Geben Sie Gegenstände kostenlos ab</p>
//               </div>
//             </label>

//             <label className={`category-option ${formData.category === 'tauschen' ? 'selected' : ''}`}>
//               <input
//                 type="radio"
//                 name="category"
//                 value="tauschen"
//                 checked={formData.category === 'tauschen'}
//                 onChange={(e) => handleInputChange('category', e.target.value)}
//               />
//               <div className="category-card">
//                 <div className="category-icon">🔄</div>
//                 <h3>Tauschen</h3>
//                 <p>Tauschen Sie Gegenstände gegen andere</p>
//               </div>
//             </label>

//             <label className={`category-option ${formData.category === 'suchen' ? 'selected' : ''}`}>
//               <input
//                 type="radio"
//                 name="category"
//                 value="suchen"
//                 checked={formData.category === 'suchen'}
//                 onChange={(e) => handleInputChange('category', e.target.value)}
//               />
//               <div className="category-card">
//                 <div className="category-icon">🔍</div>
//                 <h3>Suchen</h3>
//                 <p>Suchen Sie nach bestimmten Gegenständen</p>
//               </div>
//             </label>
//           </div>
//         </div>

//         {/* Titel */}
//         <div className="form-group">
//           <label>Titel *</label>
//           <input
//             type="text"
//             value={formData.title}
//             onChange={(e) => handleInputChange('title', e.target.value)}
//             placeholder="z.B. Schöner Sessel zu verschenken"
//             maxLength={100}
//             className={errors.title ? 'error' : ''}
//           />
//           {errors.title && <span className="error-message">{errors.title}</span>}
//           <div className="char-count">{formData.title.length}/100</div>
//         </div>

//         {/* Beschreibung */}
//         <div className="form-group">
//           <label>Beschreibung *</label>
//           <textarea
//             value={formData.description}
//             onChange={(e) => handleInputChange('description', e.target.value)}
//             placeholder="Beschreiben Sie den Gegenstand, Zustand, Abholung, etc."
//             rows={5}
//             maxLength={1000}
//             className={errors.description ? 'error' : ''}
//           />
//           {errors.description && <span className="error-message">{errors.description}</span>}
//           <div className="char-count">{formData.description.length}/1000</div>
//         </div>

//         {/* Tausch-Feld (nur bei Kategorie "tauschen") */}
//         {formData.category === 'tauschen' && (
//           <div className="form-group">
//             <label>Tausche gegen *</label>
//             <input
//               type="text"
//               value={formData.tauschGegen}
//               onChange={(e) => handleInputChange('tauschGegen', e.target.value)}
//               placeholder="Was möchten Sie im Tausch erhalten?"
//               maxLength={200}
//               className={errors.tauschGegen ? 'error' : ''}
//             />
//             {errors.tauschGegen && <span className="error-message">{errors.tauschGegen}</span>}
//             <div className="char-count">{formData.tauschGegen.length}/200</div>
//           </div>
//         )}

//         {/* Bild - OPTIONAL */}
//         <div className="form-group">
//           <label>Bild (optional)</label> {/* ← Entferne das * */}
//           <div className="image-upload-section">
//             <div className="upload-options">
//               <div className="upload-option">
//                 <label className="file-upload-btn">
//                   <Upload size={20} />
//                   Datei hochladen
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     style={{ display: 'none' }}
//                   />
//                 </label>
//                 <span className="upload-info">Max. 5MB (optional)</span>
//               </div>
              
//               <div className="upload-divider">oder</div>
              
//               <div className="upload-option">
//                 <input
//                   type="url"
//                   placeholder="Bild-URL eingeben (optional)"
//                   onChange={(e) => handleImageUrlChange(e.target.value)}
//                   className="url-input"
//                 />
//               </div>
//             </div>

//             {imagePreview && (
//               <div className="image-preview">
//                 <img src={imagePreview} alt="Vorschau" />
//                 <button
//                   type="button"
//                   onClick={removeImage}
//                   className="remove-image"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             )}
            
//           </div>
//         </div>

//         {/* Ersteller Info */}

       
//         <div className="creator-info">
//           <h3>📋 Anzeige wird erstellt als</h3>
//           <p>👤 {user?.nickname || user?.username}</p>
//           <small>Nur Ihr Benutzername wird in der Anzeige angezeigt.</small>
//         </div>

//         {/* Submit */}
//         <div className="form-actions">
//           <button
//             type="button"
//             onClick={() => navigate('/exchange')}
//             className="btn btn-cancel"
//           >
//             Abbrechen
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="btn btn-create"
//           >
//             {loading ? '⏳ Erstelle...' : '✅ Anzeige erstellen'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ExchangeCreate;