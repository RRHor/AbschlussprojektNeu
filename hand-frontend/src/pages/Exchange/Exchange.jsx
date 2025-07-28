// import { Routes, Route, NavLink } from 'react-router-dom';
// import Verschenken from './Verschenken.jsx';
// import Tauschen from './Tauschen.jsx';
// import Suchen from './Suchen.jsx';
// import Hilfe from './Hilfe.jsx';
// import './Exchange.css';

// const Exchange = () => {
//   return (
//     <div className="exchange-page">
//       <Routes>
//         {/* Hauptansicht mit 4 Kacheln */}
//         <Route
//           index
//           element={
//             <div className="exchange-grid">
//               <NavLink to="verschenken" className="exchange-box verschenken-box">
//                 🎁<span>Verschenken</span>
//               </NavLink>
//               <NavLink to="tauschen" className="exchange-box tauschen-box">
//                 🔁<span>Tauschen</span>
//               </NavLink>
//               <NavLink to="suchen" className="exchange-box suchen-box">
//                 🔍<span>Suchen</span>
//               </NavLink>
//               <NavLink to="hilfe" className="exchange-box hilfe-box">
//                 ❓<span>Hilfe</span>
//               </NavLink>
//             </div>
//           }
//         />
//         {/* Unterseiten */}
//         <Route path="verschenken" element={<Verschenken />} />
//         <Route path="tauschen" element={<Tauschen />} />
//         <Route path="suchen" element={<Suchen />} />
//         <Route path="hilfe" element={<Hilfe />} />
//       </Routes>
//     </div>
//   );
// };

// export default Exchange;

//Router-Switcher von Arben

import React, { useState } from 'react';
import { Calendar, User, Search, Tag, PlusCircle, XCircle, MessageCircle, Send, ChevronDown, ChevronUp, MapPin, Gift, RefreshCw, HelpCircle, Eye } from 'lucide-react';
import './Exchange.css';

const Exchange = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('alle');
  const [expandedComments, setExpandedComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showAddItemPopup, setShowAddItemPopup] = useState(false);
  
  const [comments, setComments] = useState({
    1: [{ id: 1, author: "Klaus Müller", content: "Ist das Sofa noch verfügbar?", date: "2025-07-21", replies: [] }]
  });

  const [newItem, setNewItem] = useState({
    title: '', description: '', author: '', category: 'verschenken', 
    subcategory: 'verschenken', location: '', condition: 'gut', image: ''
  });

  const [items, setItems] = useState([
    {
      id: 1, title: "Gemütliches 2-Sitzer Sofa", 
      description: "Bequemes Sofa in gutem Zustand, nur ein paar kleine Gebrauchsspuren.",
      author: "Maria Schmidt", date: "2025-07-21", category: "verschenken", subcategory: "verschenken",
      location: "Mitte, 10117 Berlin", condition: "gut", status: "verfügbar",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=300&fit=crop"
    },
    {
      id: 2, title: "Kinderbücher gegen Küchengeräte",
      description: "Biete 20 Kinderbücher (3-8 Jahre) und suche dafür Küchengeräte.",
      author: "Familie Müller", date: "2025-07-20", category: "tauschen", subcategory: "tauschen",
      location: "Prenzlauer Berg, 10405 Berlin", condition: "sehr gut", status: "verfügbar",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=300&fit=crop",
      wantedItems: "Küchengeräte (Mixer, Toaster, etc.)"
    },
    {
      id: 3, title: "Suche: Fahrrad 26 Zoll",
      description: "Ich suche ein funktionsfähiges Damenrad, 26 Zoll. Gerne auch reparaturbedürftig.",
      author: "Anna Grün", date: "2025-07-19", category: "suche", subcategory: "suchen",
      location: "Kreuzberg, 10961 Berlin", condition: "egal", status: "aktiv",
      image: "https://www.entsorgo.de/wp-content/uploads/Fahrrad-entsorgen.jpg"
    },
    {
      id: 4, title: "Hilfe beim Umzug gesucht",
      description: "Suche 2-3 helfende Hände für Umzug am Wochenende. Pizza und Getränke gibt's!",
      author: "Lisa Blume", date: "2025-07-17", category: "hilfe", subcategory: "hilfe",
      location: "Friedrichshain, 10243 Berlin", status: "aktiv",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=300&fit=crop"
    }
  ]);

  const categories = [
    { value: 'alle', label: 'Alle Kategorien', icon: '🔍' },
    { value: 'verschenken', label: 'Verschenken', icon: '🎁' },
    { value: 'tauschen', label: 'Tauschen', icon: '🔄' },
    { value: 'suche', label: 'Suche', icon: '👀' },
    { value: 'hilfe', label: 'Hilfe', icon: '🤝' }
  ];

  const subcategories = [
    { value: 'verschenken', label: 'Verschenken' },
    { value: 'tauschen', label: 'Tauschen' },
    { value: 'suchen', label: 'Suchen' },
    { value: 'hilfe', label: 'Hilfe' }
  ];

  const conditions = [
    { value: 'neu', label: 'Neu' },
    { value: 'sehr gut', label: 'Sehr gut' },
    { value: 'gut', label: 'Gut' },
    { value: 'gebraucht', label: 'Gebraucht' },
    { value: 'egal', label: 'Egal' }
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'alle' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const getCategoryData = (categoryValue) => {
    return categories.find(cat => cat.value === categoryValue) || { label: categoryValue, icon: '📝' };
  };

  const getStatusColor = (status, category) => {
    if (category === 'suche' || category === 'hilfe') {
      return status === 'aktiv' ? '#22c55e' : '#6b7280';
    }
    return status === 'verfügbar' ? '#22c55e' : status === 'reserviert' ? '#f59e0b' : '#ef4444';
  };

  const getStatusLabel = (status, category) => {
    if (category === 'suche' || category === 'hilfe') {
      return status === 'aktiv' ? 'Aktiv' : 'Erfüllt';
    }
    return status === 'verfügbar' ? 'Verfügbar' : status === 'reserviert' ? 'Reserviert' : 'Vergeben';
  };

  const handleContactUser = (itemId) => {
    const item = items.find(i => i.id === itemId);
    alert(`Kontakt zu ${item.author} wird hergestellt.`);
  };

  const handleNewItemSubmit = (e) => {
    e.preventDefault();
    if (!newItem.title || !newItem.description || !newItem.author || !newItem.location) {
      alert("Bitte füllen Sie alle erforderlichen Felder aus.");
      return;
    }

    const newItemEntry = {
      ...newItem,
      id: Math.max(...items.map(item => item.id)) + 1,
      date: new Date().toISOString().split('T')[0],
      status: newItem.category === 'suche' || newItem.category === 'hilfe' ? 'aktiv' : 'verfügbar',
      image: newItem.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961c3e?w=600&h=300&fit=crop'
    };

    setItems([newItemEntry, ...items]);
    setShowAddItemPopup(false);
    setNewItem({ title: '', description: '', author: '', category: 'verschenken', subcategory: 'verschenken', location: '', condition: 'gut', image: '' });
    alert("Eintrag erfolgreich hinzugefügt!");
  };

  const submitComment = (itemId) => {
    const comment = newComment[itemId];
    if (!comment?.content?.trim() || !comment?.author?.trim()) {
      alert("Bitte Name und Kommentar eingeben.");
      return;
    }

    const newCommentEntry = {
      id: Date.now(),
      author: comment.author,
      content: comment.content,
      date: new Date().toISOString().split('T')[0],
      replies: []
    };

    setComments(prev => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), newCommentEntry]
    }));

    setNewComment(prev => ({ ...prev, [itemId]: { author: '', content: '' } }));
  };

  return (
    <div className="exchange-container">
      {/* Header */}
      <div className="exchange-header">
        <h1>Verschenken & Tauschen</h1>
        <p>Teile, tausche, finde und helfe in deiner Nachbarschaft</p>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.icon} {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="main-layout">
        {/* Main Content */}
        <div>
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.id} className="item-card">
                <div className="item-image-container">
                  <img src={item.image} alt={item.title} className="item-image" />
                  <div className="category-badge">
                    {getCategoryData(item.category).icon} {getCategoryData(item.category).label}
                  </div>
                  <div className="status-badge" style={{ backgroundColor: getStatusColor(item.status, item.category) }}>
                    {getStatusLabel(item.status, item.category)}
                  </div>
                </div>

                <div className="item-content">
                  <h2 className="item-title">{item.title}</h2>
                  <p className="item-description">{item.description}</p>

                  <div className="item-details">
                    <div className="item-detail">
                      <MapPin size={16} />
                      <span>{item.location}</span>
                    </div>
                    {item.condition && (
                      <div className="item-detail">
                        <Gift size={16} />
                        <span>Zustand: {item.condition}</span>
                      </div>
                    )}
                    {item.wantedItems && (
                      <div className="item-detail">
                        <RefreshCw size={16} />
                        <span>Sucht: {item.wantedItems}</span>
                      </div>
                    )}
                  </div>

                  <div className="item-meta">
                    <div className="meta-info">
                      <div className="meta-item">
                        <User size={16} />
                        <span>{item.author}</span>
                      </div>
                      <div className="meta-item">
                        <Calendar size={16} />
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="button-group">
                    <button
                      onClick={() => handleContactUser(item.id)}
                      disabled={item.status === 'vergeben' || item.status === 'erfüllt'}
                      className="contact-button"
                    >
                      {item.status === 'vergeben' || item.status === 'erfüllt' ? 
                        (item.category === 'suche' || item.category === 'hilfe' ? 'Erfüllt' : 'Vergeben') :
                        'Kontakt aufnehmen'
                      }
                    </button>
                    
                    <button
                      onClick={() => setExpandedComments(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className="comments-button"
                    >
                      <MessageCircle size={16} />
                      <span>{(comments[item.id] || []).length} Kommentare</span>
                      {expandedComments[item.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {/* Comments Section */}
                  {expandedComments[item.id] && (
                    <div className="comments-section">
                      <h3 className="comments-title">Kommentare</h3>
                      
                      {comments[item.id] && comments[item.id].map(comment => (
                        <div key={comment.id} className="comment">
                          <div className="comment-header">
                            <strong className="comment-author">{comment.author}</strong>
                            <span>{formatDate(comment.date)}</span>
                          </div>
                          <p className="comment-content">{comment.content}</p>
                        </div>
                      ))}
                      
                      <div className="comment-form">
                        <input
                          type="text"
                          placeholder="Dein Name"
                          value={newComment[item.id]?.author || ''}
                          onChange={(e) => setNewComment(prev => ({ ...prev, [item.id]: { ...prev[item.id], author: e.target.value } }))}
                          className="comment-input"
                        />
                        <textarea
                          placeholder="Dein Kommentar..."
                          value={newComment[item.id]?.content || ''}
                          onChange={(e) => setNewComment(prev => ({ ...prev, [item.id]: { ...prev[item.id], content: e.target.value } }))}
                          rows="2"
                          className="comment-textarea"
                        />
                        <button
                          onClick={() => submitComment(item.id)}
                          className="comment-submit"
                        >
                          <Send size={16} />
                          Kommentar senden
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">Keine Einträge gefunden.</p>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="sidebar-section">
            <h3 className="sidebar-title">Kategorien</h3>
            <div className="category-buttons">
              {categories.slice(1).map(category => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`category-button ${selectedCategory === category.value ? 'active' : 'inactive'}`}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Eintrag hinzufügen</h3>
            <p className="add-item-description">
              Hast du etwas zu verschenken, tauschen, suchst etwas oder brauchst Hilfe?
            </p>
            <button
              onClick={() => setShowAddItemPopup(true)}
              className="add-item-button"
            >
              <PlusCircle size={18} />
              Eintrag hinzufügen
            </button>
          </div>
        </div>
      </div>

      {/* Add Item Popup */}
      {showAddItemPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h2 className="popup-title">Neuen Eintrag erstellen</h2>
              <button
                onClick={() => setShowAddItemPopup(false)}
                className="popup-close"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleNewItemSubmit}>
              <div className="form-group">
                <label className="form-label">Kategorie:</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value, subcategory: e.target.value })}
                  className="form-select"
                >
                  {categories.slice(1).map(category => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Titel:</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Beschreibung:</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  rows="3"
                  required
                  className="form-textarea"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Dein Name:</label>
                <input
                  type="text"
                  value={newItem.author}
                  onChange={(e) => setNewItem({ ...newItem, author: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Standort:</label>
                <input
                  type="text"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  placeholder="z.B. Mitte, 10117 Berlin"
                  required
                  className="form-input"
                />
              </div>

              {(newItem.category === 'verschenken' || newItem.category === 'tauschen' || newItem.category === 'suche') && (
                <div className="form-group">
                  <label className="form-label">Zustand:</label>
                  <select
                    value={newItem.condition}
                    onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })}
                    className="form-select"
                  >
                    {conditions.map(condition => (
                      <option key={condition.value} value={condition.value}>
                        {condition.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {newItem.category === 'tauschen' && (
                <div className="form-group">
                  <label className="form-label">Ich suche dafür:</label>
                  <input
                    type="text"
                    value={newItem.wantedItems || ''}
                    onChange={(e) => setNewItem({ ...newItem, wantedItems: e.target.value })}
                    placeholder="z.B. Bücher, Pflanzen, Küchengeräte"
                    className="form-input"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label">Bild-URL (optional):</label>
                <input
                  type="url"
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  placeholder="https://..."
                  className="form-input"
                />
              </div>

              <div className="form-buttons">
                <button
                  type="button"
                  onClick={() => setShowAddItemPopup(false)}
                  className="cancel-button"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="submit-button"
                >
                  Eintrag erstellen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exchange;
