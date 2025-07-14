import React, { useState } from 'react';
import { Calendar, User, Search, Tag, PlusCircle, XCircle, MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';
import './Blog.css';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('alle');
  const [expandedComments, setExpandedComments] = useState({});
  const [newComment, setNewComment] = useState({});
  
  const [comments, setComments] = useState({
    1: [
      {
        id: 1,
        author: "Klaus Müller",
        content: "Tolle Idee! Wir sollten das auch in unserer Straße umsetzen.",
        date: "2025-06-21",
        replies: [
          {
            id: 2,
            author: "Maria Grün",
            content: "Gerne helfe ich euch dabei! Meldet euch einfach bei mir.",
            date: "2025-06-21"
          }
        ]
      },
      {
        id: 3,
        author: "Susanne Berg",
        content: "Wie habt ihr das mit den Genehmigungen gemacht?",
        date: "2025-06-20",
        replies: []
      }
    ],
    2: [
      {
        id: 4,
        author: "Peter Schmidt",
        content: "Nachbarschaftshilfe ist wirklich wichtig. Danke für den Artikel!",
        date: "2025-06-19",
        replies: []
      }
    ]
  });

  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "Wie wir unseren Kiez grüner gemacht haben",
      excerpt: "Ein Jahr lang haben wir gemeinsam daran gearbeitet, mehr Grün in unsere Straßen zu bringen. Hier ist unsere Geschichte...",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      author: "Maria Grün",
      date: "2025-06-20",
      category: "umwelt",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Nachbarschaftshilfe in Zeiten des Wandels",
      excerpt: "Warum gegenseitige Unterstützung wichtiger denn je ist und wie wir alle davon profitieren können.",
      content: "In unserer schnelllebigen Zeit ist es wichtig, dass wir als Nachbarn zusammenhalten...",
      author: "Thomas Hilfreich",
      date: "2025-06-18",
      category: "gemeinschaft",
      readTime: "7 min",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=300&fit=crop"
    },
    {
      id: 3,
      title: "DIY-Tipps: Reparieren statt wegwerfen",
      excerpt: "Einfache Anleitungen für alltägliche Reparaturen, die jeder zu Hause durchführen kann.",
      content: "Nachhaltigkeit beginnt bei uns zu Hause. Mit diesen einfachen Tipps könnt ihr...",
      author: "Anna Reparatur",
      date: "2025-06-15",
      category: "tipps",
      readTime: "10 min",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Erfolgsgeschichte: Unser Gemeinschaftsgarten",
      excerpt: "Von der leeren Brachfläche zum blühenden Treffpunkt - wie aus einer Idee Realität wurde.",
      content: "Es begann mit einer einfachen Idee: Was wäre, wenn wir die ungenutzte Fläche...",
      author: "Familie Weber",
      date: "2025-06-12",
      category: "projekte",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=300&fit=crop"
    },
    {
      id: 5,
      title: "Seniorenbetreuung: Ein Herzensprojekt",
      excerpt: "Wie junge Familien und Senioren voneinander lernen und sich gegenseitig unterstützen können.",
      content: "Generationenübergreifende Hilfe ist das Herzstück unserer Nachbarschaft...",
      author: "Lisa Jung",
      date: "2025-06-10",
      category: "soziales",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600&h=300&fit=crop"
    },
    {
      id: 6,
      title: "Lokale Geschäfte unterstützen",
      excerpt: "Warum der Einkauf um die Ecke nicht nur praktisch ist, sondern auch unsere Gemeinschaft stärkt.",
      content: "Jeder Euro, den wir in lokalen Geschäften ausgeben, kommt unserer Nachbarschaft zugute...",
      author: "Peter Lokal",
      date: "2025-06-08",
      category: "wirtschaft",
      readTime: "4 min",
      image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=600&h=300&fit=crop"
    }
  ]);

  const [showWritePostPopup, setShowWritePostPopup] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'umwelt',
    image: '',
    readTime: ''
  });

  const categories = [
    { value: 'alle', label: 'Alle Beiträge' },
    { value: 'umwelt', label: 'Umwelt & Natur' },
    { value: 'gemeinschaft', label: 'Gemeinschaft' },
    { value: 'tipps', label: 'Tipps & Tricks' },
    { value: 'projekte', label: 'Projekte' },
    { value: 'soziales', label: 'Soziales' },
    { value: 'wirtschaft', label: 'Lokale Wirtschaft' }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'alle' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCategoryLabel = (categoryValue) => {
    return categories.find(cat => cat.value === categoryValue)?.label || categoryValue;
  };

  const handleReadMore = (postId) => {
    console.log(`"Weiterlesen" für Beitrag ID: ${postId} geklickt.`);
    alert(`Artikel "${blogPosts.find(p => p.id === postId)?.title}" wird geladen.`);
  };

  const handleWritePost = () => {
    setShowWritePostPopup(true);
  };

  const handleClosePopup = () => {
    setShowWritePostPopup(false);
    setNewPost({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: 'umwelt',
      image: '',
      readTime: ''
    });
  };

  const handleNewPostChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prevPost => ({
      ...prevPost,
      [name]: value
    }));
  };

  const handleNewPostSubmit = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !newPost.author || !newPost.category) {
      alert("Bitte füllen Sie alle erforderlichen Felder aus (Titel, Inhalt, Autor, Kategorie).");
      return;
    }

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const newBlogEntry = {
      id: blogPosts.length > 0 ? Math.max(...blogPosts.map(post => post.id)) + 1 : 1,
      ...newPost,
      date: formattedDate,
      image: newPost.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961c3e?w=600&h=300&fit=crop'
    };

    setBlogPosts(prevPosts => [newBlogEntry, ...prevPosts]);
    handleClosePopup();
    alert("Ihr Beitrag wurde erfolgreich hinzugefügt!");
  };

  // Kommentar-Funktionen
  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentChange = (postId, value) => {
    setNewComment(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        content: value
      }
    }));
  };

  const handleCommentAuthorChange = (postId, value) => {
    setNewComment(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        author: value
      }
    }));
  };

  const submitComment = (postId) => {
    const comment = newComment[postId];
    if (!comment?.content?.trim() || !comment?.author?.trim()) {
      alert("Bitte Name und Kommentar eingeben.");
      return;
    }

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const newCommentEntry = {
      id: Date.now(),
      author: comment.author,
      content: comment.content,
      date: formattedDate,
      replies: []
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newCommentEntry]
    }));

    setNewComment(prev => ({
      ...prev,
      [postId]: { author: '', content: '' }
    }));
  };

  const getCommentCount = (postId) => {
    const postComments = comments[postId] || [];
    return postComments.reduce((count, comment) => count + 1 + comment.replies.length, 0);
  };

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Nachbarschafts-Blog</h1>
        <p>Geschichten, Tipps und Erfahrungen aus unserer Gemeinschaft</p>
      </div>

      <div className="blog-filters">
        <div className="search-bar">
          <Search className="search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder="Blog durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Blog durchsuchen"
          />
        </div>

        <div className="category-filter">
          <Tag className="filter-icon" aria-hidden="true" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Kategorie filtern"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="blog-content">
        <div className="blog-posts">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <article key={post.id} className="blog-card">
                <div className="blog-image">
                  <img src={post.image} alt={`Bild für den Beitrag: ${post.title}`} />
                  <div className="blog-category">
                    {getCategoryLabel(post.category)}
                  </div>
                </div>

                <div className="blog-content-area">
                  <h2 className="blog-title">{post.title}</h2>
                  <p className="blog-excerpt">{post.excerpt}</p>

                  <div className="blog-meta">
                    <div className="meta-left">
                      <div className="meta-item">
                        <User className="meta-icon" aria-hidden="true" />
                        <span>{post.author}</span>
                      </div>
                      <div className="meta-item">
                        <Calendar className="meta-icon" aria-hidden="true" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="blog-actions">
                    <button
                      className="read-more-btn"
                      onClick={() => handleReadMore(post.id)}
                      aria-label={`Weiterlesen: ${post.title}`}
                    >
                      Weiterlesen
                    </button>
                    
                    <button
                      className="comment-toggle-btn"
                      onClick={() => toggleComments(post.id)}
                      aria-label={`Kommentare anzeigen: ${post.title}`}
                    >
                      <MessageCircle className="comment-icon" aria-hidden="true" />
                      <span>{getCommentCount(post.id)} Kommentare</span>
                      {expandedComments[post.id] ? 
                        <ChevronUp className="chevron-icon" aria-hidden="true" /> :
                        <ChevronDown className="chevron-icon" aria-hidden="true" />
                      }
                    </button>
                  </div>

                  {/* Kommentarsektion */}
                  {expandedComments[post.id] && (
                    <div className="comments-section">
                      <h3 className="comments-title">Kommentare</h3>
                      
                      {/* Bestehende Kommentare */}
                      <div className="comments-list">
                        {comments[post.id] && comments[post.id].map(comment => (
                          <div key={comment.id} className="comment">
                            <div className="comment-header">
                              <span className="comment-author">{comment.author}</span>
                              <span className="comment-date">{formatDate(comment.date)}</span>
                            </div>
                            <p className="comment-content">{comment.content}</p>
                            
                            {/* Antworten */}
                            {comment.replies.length > 0 && (
                              <div className="comment-replies">
                                {comment.replies.map(reply => (
                                  <div key={reply.id} className="comment-reply">
                                    <div className="reply-header">
                                      <span className="reply-author">{reply.author}</span>
                                      <span className="reply-date">{formatDate(reply.date)}</span>
                                    </div>
                                    <p className="reply-content">{reply.content}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Neuer Kommentar */}
                      <div className="new-comment-form">
                        <h4 className="new-comment-title">Kommentar hinzufügen</h4>
                        <input
                          type="text"
                          className="comment-author-input"
                          placeholder="Dein Name"
                          value={newComment[post.id]?.author || ''}
                          onChange={(e) => handleCommentAuthorChange(post.id, e.target.value)}
                        />
                        <textarea
                          className="comment-content-input"
                          placeholder="Dein Kommentar..."
                          value={newComment[post.id]?.content || ''}
                          onChange={(e) => handleCommentChange(post.id, e.target.value)}
                          rows="3"
                        />
                        <button
                          className="comment-submit-btn"
                          onClick={() => submitComment(post.id)}
                        >
                          <Send className="send-icon" aria-hidden="true" />
                          Kommentar senden
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="no-posts">
              <p>Keine Beiträge gefunden. Versuchen Sie es mit anderen Suchbegriffen oder Filtern.</p>
            </div>
          )}
        </div>

        <aside className="blog-sidebar">
          <div className="sidebar-widget">
            <h3>Beliebte Kategorien</h3>
            <div className="category-tags">
              {categories.slice(1).map(category => (
                <button
                  key={category.value}
                  className={`category-tag ${selectedCategory === category.value ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.value)}
                  aria-label={`Filter nach Kategorie: ${category.label}`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-widget">
            <h3>Neueste Beiträge</h3>
            <div className="recent-posts">
              {blogPosts.slice(0, 3).map(post => (
                <div key={post.id} className="recent-post">
                  <img src={post.image} alt={`Vorschaubild für den Beitrag: ${post.title}`} />
                  <div className="recent-post-content">
                    <h4>{post.title}</h4>
                    <span className="recent-date">{formatDate(post.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-widget">
            <h3>Schreib einen Beitrag</h3>
            <p>Teile deine Geschichte mit der Nachbarschaft!</p>
            <button
              className="write-post-btn"
              onClick={handleWritePost}
              aria-label="Neuen Blogbeitrag schreiben"
            >
              <PlusCircle className="action-icon" aria-hidden="true" />
              <span className="action-icon-text">Beitrag schreiben</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Popup für neuen Beitrag */}
      {showWritePostPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-popup-btn" onClick={handleClosePopup} aria-label="Popup schließen">
              <XCircle size={24} />
            </button>
            <h2>Neuen Blogbeitrag schreiben</h2>
            <form onSubmit={handleNewPostSubmit} className="new-post-form">
              <div className="form-group">
                <label htmlFor="post-title">Titel:</label>
                <input
                  type="text"
                  id="post-title"
                  name="title"
                  value={newPost.title}
                  onChange={handleNewPostChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="post-excerpt">Kurzbeschreibung (Excerpt):</label>
                <textarea
                  id="post-excerpt"
                  name="excerpt"
                  value={newPost.excerpt}
                  onChange={handleNewPostChange}
                  rows="2"
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="post-content">Inhalt:</label>
                <textarea
                  id="post-content"
                  name="content"
                  value={newPost.content}
                  onChange={handleNewPostChange}
                  rows="6"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="post-author">Autor:</label>
                <input
                  type="text"
                  id="post-author"
                  name="author"
                  value={newPost.author}
                  onChange={handleNewPostChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="post-category">Kategorie:</label>
                <select
                  id="post-category"
                  name="category"
                  value={newPost.category}
                  onChange={handleNewPostChange}
                >
                  {categories.slice(1).map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="post-image">Bild-URL (optional):</label>
                <input
                  type="url"
                  id="post-image"
                  name="image"
                  value={newPost.image}
                  onChange={handleNewPostChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="post-readtime">Lesezeit (z.B. "5 min", optional):</label>
                <input
                  type="text"
                  id="post-readtime"
                  name="readTime"
                  value={newPost.readTime}
                  onChange={handleNewPostChange}
                />
              </div>
              <button type="submit" className="submit-post-btn">Beitrag hinzufügen</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;