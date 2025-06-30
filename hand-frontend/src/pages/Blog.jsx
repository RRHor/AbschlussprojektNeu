import React, { useState } from 'react';
import { Calendar, User, Search, Tag, PlusCircle } from 'lucide-react';
import './Blog.css';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('alle');
  const [blogPosts, setBlogPosts] = useState([ // Umbenannt von postData zu blogPosts, da keine dynamischen Änderungen an Likes mehr nötig sind
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


  const categories = [
    { value: 'alle', label: 'Alle Beiträge' },
    { value: 'umwelt', label: 'Umwelt & Natur' },
    { value: 'gemeinschaft', label: 'Gemeinschaft' },
    { value: 'tipps', label: 'Tipps & Tricks' },
    { value: 'projekte', label: 'Projekte' },
    { value: 'soziales', label: 'Soziales' },
    { value: 'wirtschaft', label: 'Lokale Wirtschaft' }
  ];

  const filteredPosts = blogPosts.filter(post => { // Verwendet jetzt blogPosts statt postData
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'alle' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 'toggleLike' Funktion entfernt

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
    alert(`Artikel "${blogPosts.find(p => p.id === postId)?.title}" wird geladen.`); // Verwendet blogPosts
  };

  const handleWritePost = () => {
    console.log("Button 'Beitrag schreiben' geklickt.");
    alert("Funktion 'Beitrag schreiben' wird geöffnet.");
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
    </div>
  );
};

export default Blog;