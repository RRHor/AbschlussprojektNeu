import React, { useState, useEffect } from 'react';
import { Calendar, User, Search, Tag, PlusCircle, XCircle, MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';
import './Blog.css';

// API_URL nur einmal deklarieren
const API_URL = import.meta.env.VITE_API_URL;

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

  const staticPosts = [
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
  ];

  const [blogsPosts, setblogsPosts] = useState(staticPosts);

  // Blog-Posts aus Backend laden und mit statischen Beiträgen kombinieren
  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/blogs`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Dynamische Beiträge zuerst, dann statische
        setblogsPosts([...data, ...staticPosts]);
        // Kommentare für alle dynamischen Blogposts laden
        data.forEach(post => {
          if (post._id) {
            fetchComments(post._id);
          }
        });
      }
    } catch (err) {
      console.error('Fehler beim Laden der Blogs:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

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

  const filteredPosts = blogsPosts.filter(post => {
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
    alert(`Artikel "${blogsPosts.find(p => p.id === postId)?.title}" wird geladen.`);
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

  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !newPost.author || !newPost.category) {
      alert("Bitte füllen Sie alle erforderlichen Felder aus (Titel, Inhalt, Autor, Kategorie).");
      return;
    }

    // Backend erwartet: title, description, tags, images
    const blogsData = {
      title: newPost.title,
      description: newPost.content,
      tags: [newPost.category],
      images: newPost.image ? [newPost.image] : []
      // author wird im Backend aus dem Token gesetzt
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(blogsData)
      });

      if (res.ok) {
        await fetchBlogs(); // Nach dem Speichern Blogs neu laden
        alert("Ihr Beitrag wurde erfolgreich hinzugefügt!");
        handleClosePopup();
      } else {
        const error = await res.json();
        alert("Fehler beim Speichern: " + (error.message || "Unbekannter Fehler"));
      }
    } catch (err) {
      alert("Netzwerkfehler: " + err.message);
    }
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

  // Hilfsfunktion für die korrekte postId (Backend: dynamische Posts haben _id, statische Posts id)
  const getPostId = (post) => post._id ? post._id : post.id;

  const submitComment = async (postIdRaw) => {
    // Nur für dynamische Blogposts (_id vorhanden) an Backend senden
    const postId = postIdRaw;
    const comment = newComment[postId];
    if (!comment?.content?.trim() || !comment?.author?.trim()) {
      alert("Bitte Name und Kommentar eingeben.");
      return;
    }

    // Hilfsfunktion: Ist die ID ein gültiger MongoDB ObjectId?
    const isValidMongoId = (id) => typeof id === 'string' && id.length === 24 && /^[a-fA-F0-9]{24}$/.test(id);

    if (isValidMongoId(postId)) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/blogs-comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify({
            text: comment.content,
            blogs: postId
          })
        });
        if (res.ok) {
          await fetchComments(postId);
          setNewComment(prev => ({
            ...prev,
            [postId]: { author: '', content: '' }
          }));
          alert("Kommentar erfolgreich gesendet!");
        } else {
          const error = await res.json();
          alert("Fehler beim Senden: " + (error.message || "Unbekannter Fehler"));
        }
      } catch (err) {
        alert("Netzwerkfehler: " + err.message);
      }
    } else {
      // Für statische Posts oder ungültige IDs nur lokal speichern
      setComments(prev => ({
        ...prev,
        [postId]: [
          ...(prev[postId] || []),
          {
            id: Date.now(),
            author: comment.author,
            content: comment.content,
            date: new Date().toISOString(),
            replies: []
          }
        ]
      }));
      setNewComment(prev => ({
        ...prev,
        [postId]: { author: '', content: '' }
      }));
      alert("Test-Kommentar lokal hinzugefügt!");
    }
  };

  // Kommentare aus Backend laden und mit Test-Kommentaren kombinieren
  const fetchComments = async (postId) => {
    try {
      const res = await fetch(`${API_URL}/blogs-comments/${postId}`);
      let backendComments = [];
      if (res.ok) {
        const data = await res.json();
        backendComments = data.map(item => ({
          id: item._id,
          author: item.user?.nickname || '',
          content: item.text,
          date: item.createdAt,
          replies: []
        }));
      }
      // Test-Kommentare für diese ID (egal ob dynamisch oder statisch)
      const testComments = comments[postId] ? comments[postId].filter(c => !c.id || typeof c.id !== 'string') : [];
      setComments(prev => ({
        ...prev,
        [postId]: [...backendComments, ...testComments]
      }));
    } catch (err) {
      console.error('Fehler beim Laden der Kommentare:', err);
    }
  };

  const getCommentCount = (postId) => {
    const postComments = comments[postId] || [];
    return postComments.reduce((count, comment) => count + 1 + comment.replies.length, 0);
  };

  return (
    <div className="blogs-container">
      <div className="blogs-header">
        <h1>Nachbarschafts-blogs</h1>
        <p>Geschichten, Tipps und Erfahrungen aus unserer Gemeinschaft</p>
      </div>

      <div className="blogs-filters">
        <div className="search-bar">
          <Search className="search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder="blogs durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="blogs durchsuchen"
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

      <div className="blogs-content">
        <div className="blogs-posts">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => {
              const postKey = post._id ? post._id : 'static-' + post.id;
              const postId = post._id ? post._id : post.id;
              return (
                <article key={postKey} className="blogs-card">
                  <div className="blogs-image">
                    <img src={post.image} alt={`Bild für den Beitrag: ${post.title}`} />
                    <div className="blogs-category">
                      {getCategoryLabel(post.category)}
                    </div>
                  </div>
  
                  <div className="blogs-content-area">
                    <h2 className="blogs-title">{post.title}</h2>
                    <p className="blogs-excerpt">{post.excerpt}</p>
  
                    <div className="blogs-meta">
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
  
                    <div className="blogs-actions">
                      <button
                        className="read-more-btn"
                        onClick={() => handleReadMore(postId)}
                        aria-label={`Weiterlesen: ${post.title}`}
                      >
                        Weiterlesen
                      </button>
                      
                      <button
                        className="comment-toggle-btn"
                        onClick={() => toggleComments(postId)}
                        aria-label={`Kommentare anzeigen: ${post.title}`}
                      >
                        <MessageCircle className="comment-icon" aria-hidden="true" />
                        <span>{getCommentCount(postId)} Kommentare</span>
                        {expandedComments[postId] ? 
                          <ChevronUp className="chevron-icon" aria-hidden="true" /> :
                          <ChevronDown className="chevron-icon" aria-hidden="true" />
                        }
                      </button>
                    </div>
  
                    {/* Kommentarsektion */}
                    {expandedComments[postId] && (
                      <div className="comments-section">
                        <h3 className="comments-title">Kommentare</h3>
                        
                        {/* Bestehende Kommentare */}
                        <div className="comments-list">
                          {comments[postId] && comments[postId].map((comment, idx) => (
                            <div key={comment.id ? `comment-${comment.id}` : `comment-${postId}-${idx}`} className="comment">
                              <div className="comment-header">
                                <span className="comment-author">{comment.author}</span>
                                <span className="comment-date">{formatDate(comment.date)}</span>
                              </div>
                              <p className="comment-content">{comment.content}</p>
                              
                              {/* Antworten */}
                              {comment.replies.length > 0 && (
                                <div className="comment-replies">
                                  {comment.replies.map((reply, rIdx) => (
                                    <div key={reply.id ? `reply-${reply.id}` : `reply-${postId}-${idx}-${rIdx}`} className="comment-reply">
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
                            id={`comment-author-${postId}`}
                            name={`author-${postId}`}
                            placeholder="Dein Name"
                            value={newComment[postId]?.author || ''}
                            onChange={(e) => handleCommentAuthorChange(postId, e.target.value)}
                          />
                          <textarea
                            className="comment-content-input"
                            id={`comment-content-${postId}`}
                            name={`content-${postId}`}
                            placeholder="Dein Kommentar..."
                            value={newComment[postId]?.content || ''}
                            onChange={(e) => handleCommentChange(postId, e.target.value)}
                            rows="3"
                          />
                          <button
                            className="comment-submit-btn"
                            onClick={() => submitComment(postId)}
                          >
                            <Send className="send-icon" aria-hidden="true" />
                            Kommentar senden
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="no-posts">
              <p>Keine Beiträge gefunden. Versuchen Sie es mit anderen Suchbegriffen oder Filtern.</p>
            </div>
          )}
        </div>

        <aside className="blogs-sidebar">
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
              {blogsPosts.slice(0, 3).map(post => (
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
              aria-label="Neuen blogsbeitrag schreiben"
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
            <h2>Neuen blogsbeitrag schreiben</h2>
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