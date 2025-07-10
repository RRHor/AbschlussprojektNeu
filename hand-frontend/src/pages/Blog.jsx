import { useEffect, useState } from 'react';
import { Calendar, User, Search, Tag, PlusCircle, XCircle } from 'lucide-react'; // XCircle für Schließen-Button im Popup
import './Blog.css';
import api from '../api'; // ggf. Pfad anpassen
import { useNavigate } from "react-router-dom";

// HIER EINFÜGEN:
console.log("Blog.jsx aus pages ist aktiv!");

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('alle');
  const [blogPosts, setBlogPosts] = useState([]);
  const [showWritePostPopup, setShowWritePostPopup] = useState(false); // Neuer Zustand für das Popup
  const [newPost, setNewPost] = useState({ // Zustand für das neue Formular
    title: '',
    excerpt: '',
    content: '',
    category: 'umwelt', // Standardkategorie
    image: '',
    readTime: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/blogs")
      .then(res => setBlogPosts(res.data))
      .catch(() => setBlogPosts([]));
  }, []);

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
    const matchesSearch =
      (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof post.author === "object" &&
        ((post.author.nickname && post.author.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
         (post.author.username && post.author.username.toLowerCase().includes(searchTerm.toLowerCase()))));
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
    navigate(`/blogs/${postId}`);
  };

  const handleWritePost = () => {
    console.log('Popup öffnen');
    
    setShowWritePostPopup(true); // Popup öffnen
  };

  const handleClosePopup = () => {
    setShowWritePostPopup(false); // Popup schließen
    setNewPost({ // Formular zurücksetzen
      title: '',
      excerpt: '',
      content: '',
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
  if (!newPost.title || !newPost.content || !newPost.category) {
    alert("Bitte füllen Sie alle erforderlichen Felder aus (Titel, Inhalt, Kategorie).");
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const blogData = {
      title: newPost.title,
      excerpt: newPost.excerpt,
      content: newPost.content,
      category: newPost.category,
      readTime: newPost.readTime,
      image: newPost.image
      // author wird im Backend gesetzt!
    };
    const response = await fetch('http://localhost:4000/api/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(blogData)
    });

    if (!response.ok) throw new Error('Fehler beim Speichern des Blogposts');
    const savedPost = await response.json();

    setBlogPosts(prevPosts => [savedPost, ...prevPosts]);
    handleClosePopup();
    alert("Ihr Beitrag wurde erfolgreich hinzugefügt!");
  } catch (error) {
    alert("Fehler beim Speichern: " + error.message);
  }
};

  // const handleNewPostSubmit = (e) => {
  //   e.preventDefault();
  //   if (!newPost.title || !newPost.content || !newPost.author || !newPost.category) {
  //     alert("Bitte füllen Sie alle erforderlichen Felder aus (Titel, Inhalt, Autor, Kategorie).");
  //     return;
  //   }

  //   const today = new Date();
  //   const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  //   const newBlogEntry = {
  //     id: blogPosts.length > 0 ? Math.max(...blogPosts.map(post => post.id)) + 1 : 1,
  //     ...newPost,
  //     date: formattedDate,
  //     image: newPost.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961c3e?w=600&h=300&fit=crop' // Standardbild, wenn keines eingegeben wird
  //   };

  //   setBlogPosts(prevPosts => [newBlogEntry, ...prevPosts]); // Neuen Beitrag oben hinzufügen
  //   handleClosePopup(); // Popup schließen und Formular zurücksetzen
  //   alert("Ihr Beitrag wurde erfolgreich hinzugefügt!");
  // };


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
              <article key={post._id} className="blog-card">
                <div className="blog-image">
                  {post.image && (
                    <img src={post.image} alt={`Bild für den Beitrag: ${post.title}`} />
                  )}
                  <div className="blog-category">
                    {getCategoryLabel(post.category || (post.tags && post.tags[0]))}
                  </div>
                </div>

                <div className="blog-content-area">
                  <h2 className="blog-title">{post.title}</h2>
                  <p className="blog-excerpt">{post.excerpt || post.description}</p>

                  <div className="blog-meta">
                    <div className="meta-left">
                      <div className="meta-item">
                        <User className="meta-icon" aria-hidden="true" />
                        <span>
                          {post.author?.nickname || post.author?.username || "Unbekannt"}
                        </span>
                      </div>
                      <div className="meta-item">
                        <Calendar className="meta-icon" aria-hidden="true" />
                        <span>{formatDate(post.createdAt || post.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="blog-actions">
                    <button
                      className="read-more-btn"
                      onClick={() => handleReadMore(post._id)}
                    >
                      Weiterlesen
                    </button>
                  </div>
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
              <PlusCircle className="action-icon" aria-hidden="true" style={{ marginRight: '6px' }} />
              <span className='action-icon-text'>Beitrag schreiben</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Das Popup-Fenster */}
      {showWritePostPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            {console.log('Popup Test')}
            Test Popup
            <h1>Test Popup Sichtbar</h1>
            
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
                <label htmlFor="post-category">Kategorie:</label>
                <select
                  id="post-category"
                  name="category"
                  value={newPost.category}
                  onChange={handleNewPostChange}
                >
                  {categories.slice(1).map(category => ( // Alle außer "Alle Beiträge"
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

