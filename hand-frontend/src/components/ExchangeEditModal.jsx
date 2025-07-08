// // src/components/ExchangeEditModal.jsx
// import React, { useState } from 'react';
// import { X } from 'lucide-react';
// import './ExchangeEditModal.css';

// const ExchangeEditModal = ({ post, onClose, onUpdate }) => {
//   const [formData, setFormData] = useState({
//     title: post.title,
//     description: post.description,
//     category: post.category,
//     picture: post.picture,
//     tauschGegen: post.tauschGegen || ''
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!formData.title || !formData.description || !formData.category) {
//       alert('Bitte füllen Sie alle Pflichtfelder aus');
//       return;
//     }

//     if (formData.category === 'tauschen' && !formData.tauschGegen) {
//       alert('Bitte geben Sie an, wogegen Sie tauschen möchten');
//       return;
//     }

//     onUpdate(post._id, formData);
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Anzeige bearbeiten</h2>
//           <button className="modal-close" onClick={onClose}>
//             <X size={24} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="edit-form">
//           <div className="form-group">
//             <label>Titel *</label>
//             <input
//               type="text"
//               value={formData.title}
//               onChange={(e) => handleInputChange('title', e.target.value)}
//               maxLength={100}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Kategorie *</label>
//             <select
//               value={formData.category}
//               onChange={(e) => handleInputChange('category', e.target.value)}
//               required
//             >
//               <option value="verschenken">🎁 Verschenken</option>
//               <option value="tauschen">🔄 Tauschen</option>
//               <option value="suchen">🔍 Suchen</option>
//             </select>
//           </div>

//           <div className="form-group">
//             <label>Beschreibung *</label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => handleInputChange('description', e.target.value)}
//               maxLength={1000}
//               rows={4}
//               required
//             />
//           </div>

//           {formData.category === 'tauschen' && (
//             <div className="form-group">
//               <label>Tausche gegen *</label>
//               <input
//                 type="text"
//                 value={formData.tauschGegen}
//                 onChange={(e) => handleInputChange('tauschGegen', e.target.value)}
//                 maxLength={200}
//                 placeholder="Was möchten Sie im Tausch erhalten?"
//                 required
//               />
//             </div>
//           )}

//           <div className="form-group">
//             <label>Bild-URL *</label>
//             <input
//               type="url"
//               value={formData.picture}
//               onChange={(e) => handleInputChange('picture', e.target.value)}
//               placeholder="https://..."
//               required
//             />
//             {formData.picture && (
//               <div className="image-preview">
//                 <img src={formData.picture} alt="Vorschau" />
//               </div>
//             )}
//           </div>

//           <div className="modal-actions">
//             <button type="button" className="btn btn-cancel" onClick={onClose}>
//               Abbrechen
//             </button>
//             <button type="submit" className="btn btn-save">
//               Speichern
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ExchangeEditModal;