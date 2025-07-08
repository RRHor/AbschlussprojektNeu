// // src/pages/Exchange/ExchangeDetail.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Eye, Clock, User, Mail, MessageCircle } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';
// import exchangeService from '../../services/exchangeService';
// import './ExchangeDetail.css';

// const ExchangeDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
  
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showContactModal, setShowContactModal] = useState(false);
//   const [contactMessage, setContactMessage] = useState('');

//   useEffect(() => {
//     fetchPost();
//   }, [id]);

//   const fetchPost = async () => {
//     try {
//       setLoading(true);
//       const result = await exchangeService.getPost(id);
//       if (result.success) {
//         setPost(result.data);
//       } else {
//         setError('Post nicht gefunden');
//       }
//     } catch (error) {
//       console.error('Fehler beim Laden des Posts:', error);
//       setError('Fehler beim Laden des Posts');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case 'verschenken': return '🎁';
//       case 'tauschen': return '🔄';
//       case 'suchen': return '🔍';
//       default: return '📦';
//     }
//   };

//   const getCategoryLabel = (category) => {
//     switch (category) {
//       case 'verschenken': return 'Verschenken';
//       case 'tauschen': return 'Tauschen';
//       case 'suchen': return 'Suchen';
//       default: return category;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'aktiv': return '#28a745';
//       case 'reserviert': return '#ffc107';
//       case 'abgeschlossen': return '#6c757d';
//       default: return '#007bff';
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('de-DE', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const handleContact = () => {
//     if (!user) {
//       alert('Bitte melden Sie sich an, um Kontakt aufzunehmen');
//       navigate('/login');
//       return;
//     }
//     setShowContactModal(true);
//   };

//   const sendContactMessage = () => {
//     // Hier würde die Kontakt-API aufgerufen werden
//     alert(`Nachricht gesendet an ${post.author.nickname}:\n\n"${contactMessage}"`);
//     setShowContactModal(false);
//     setContactMessage('');
//   };

//   if (loading) {
//     return (
//       <div className="exchange-detail-loading">
//         <div className="loading-spinner">⏳</div>
//         <p>Lade Anzeige...</p>
//       </div>
//     );
//   }

//   if (error || !post) {
//     return (
//       <div className="exchange-detail-error">
//         <h2>❌ Fehler</h2>
//         <p>{error || 'Anzeige nicht gefunden'}</p>
//         <button 
//           onClick={() => navigate('/exchange')}
//           className="btn btn-back"
//         >
//           Zurück zur Übersicht
//         </button>
//       </div>
//     );
//   }

//   const isOwnPost = user && post.author._id === user._id;

//   return (
//     <div className="exchange-detail">
//       {/* Header */}
//       <div className="detail-header">
//         <button 
//           onClick={() => navigate('/exchange')}
//           className="back-button"
//         >
//           <ArrowLeft size={20} />
//           Zurück zur Übersicht
//         </button>
        
//         {isOwnPost && (
//           <div className="owner-actions">
//             <button 
//               onClick={() => navigate('/profile')}
//               className="btn btn-edit"
//             >
//               ✏️ Bearbeiten
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Main Content */}
//       <div className="detail-content">
//         {/* Image */}
//         <div className="detail-image">
//           <img src={post.picture} alt={post.title} />
//           <div 
//             className="status-badge"
//             style={{ backgroundColor: getStatusColor(post.status) }}
//           >
//             {post.status === 'aktiv' ? 'Verfügbar' : 
//              post.status === 'reserviert' ? 'Reserviert' : 'Vergeben'}
//           </div>
//         </div>

//         {/* Info */}
//         <div className="detail-info">
//           <div className="category-badge">
//             {getCategoryIcon(post.category)} {getCategoryLabel(post.category)}
//           </div>
          
//           <h1 className="detail-title">{post.title}</h1>
          
//           <div className="detail-meta">
//             <div className="meta-item">
//               <User size={16} />
//               <span>{post.author.nickname || 'Unbekannt'}</span>
//             </div>
//             <div className="meta-item">
//               <Clock size={16} />
//               <span>{formatDate(post.createdAt)}</span>
//             </div>
//             <div className="meta-item">
//               <Eye size={16} />
//               <span>{post.views} Aufrufe</span>
//             </div>
//           </div>

//           <div className="detail-description">
//             <h2>Beschreibung</h2>
//             <p>{post.description}</p>
//           </div>

//           {post.tauschGegen && (
//             <div className="trade-section">
//               <h2>Tausche gegen</h2>
//               <p className="trade-info">{post.tauschGegen}</p>
//             </div>
//           )}

//           {/* Contact Section */}
//           {!isOwnPost && post.status === 'aktiv' && (
//             <div className="contact-section">
//               <h2>Interesse?</h2>
//               <p>Kontaktieren Sie {post.author.nickname} für weitere Details.</p>
//               <button 
//                 onClick={handleContact}
//                 className="btn btn-contact"
//               >
//                 <MessageCircle size={20} />
//                 Kontakt aufnehmen
//               </button>
//             </div>
//           )}

//           {isOwnPost && (
//             <div className="owner-info">
//               <h2>📋 Ihre Anzeige</h2>
//               <p>Dies ist Ihre eigene Anzeige. Sie können sie in Ihrem Profil bearbeiten.</p>
//               <div className="owner-stats">
//                 <span>👁 {post.views} Aufrufe</span>
//                 <span>📅 Erstellt am {formatDate(post.createdAt)}</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Contact Modal */}
//       {showContactModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h2>Nachricht an {post.author.nickname}</h2>
//               <button 
//                 onClick={() => setShowContactModal(false)}
//                 className="modal-close"
//               >
//                 ✕
//               </button>
//             </div>
            
//             <div className="modal-body">
//               <p>Schreiben Sie eine Nachricht bezüglich: <strong>{post.title}</strong></p>
//               <textarea
//                 value={contactMessage}
//                 onChange={(e) => setContactMessage(e.target.value)}
//                 placeholder="Hallo! Ich interessiere mich für Ihre Anzeige..."
//                 rows={5}
//                 className="contact-textarea"
//               />
//             </div>
            
//             <div className="modal-actions">
//               <button 
//                 onClick={() => setShowContactModal(false)}
//                 className="btn btn-cancel"
//               >
//                 Abbrechen
//               </button>
//               <button 
//                 onClick={sendContactMessage}
//                 className="btn btn-send"
//                 disabled={!contactMessage.trim()}
//               >
//                 📤 Nachricht senden
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExchangeDetail;