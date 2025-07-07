import React from 'react';
import { Link } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import Footer from '../components/Footer';
import './LandingPage.css';


// Image imports
import landingphoto1 from '../assets/landingphoto/landingphoto1.png';
import landingphoto2 from '../assets/landingphoto/landingphoto2.png';
import landingphoto3 from '../assets/landingphoto/landingphoto3.png';
import landingphoto4 from '../assets/landingphoto/landingphoto4.png';
import landingphoto5 from '../assets/landingphoto/landingphoto5.avif'


// Image array
const landingPhotos = [
  landingphoto1,
  landingphoto2,
  landingphoto3,
  landingphoto4,
  landingphoto5,
];

// Section data for maintainability
const sectionData = [
  {
    id: 'events',
    title: '🎉 Events in deiner Nähe',
    description: 'Entdecke lokale Veranstaltungen und triff Nachbarn.',
    image: landingphoto1,
    imageAlt: 'Nachbarschafts-Event',
    buttonText: 'Alle Events ansehen',
    buttonLink: '/events',
    buttonType: 'primary',
    className: 'section-block section-colored'
  },
  {
    id: 'verschenke',
    title: '🎁 Verschenke & Tausche',
    description: 'Gib Dingen ein zweites Leben – verschenke oder tausche mit Nachbarn.',
    image: landingphoto2,
    imageAlt: 'Verschenke und Tausche',
    buttonText: 'Angebote ansehen',
    buttonLink: '/exchange',
    buttonType: 'primary',
    className: 'section-block'
  },
  {
    id: 'blog',
    title: '📝 Blog & Geschichten',
    description: 'Erfahre mehr über inspirierende Nachbarschaftsprojekte und Tipps.',
    image: landingphoto3,
    imageAlt: 'Blog und Geschichten',
    buttonText: 'Zum Blog',
    buttonLink: '/blog',
    buttonType: 'primary',
    className: 'section-block section-colored'
  },
  {
    id: 'ask',
    title: '❓ Häufige Fragen',
    description: 'Du hast Fragen? Wir haben Antworten für dich gesammelt.',
    image: landingphoto5,
    imageAlt: 'Häufige Fragen',
    buttonText: 'Zu den FAQs',
    buttonLink: '/help#faq',
    buttonType: 'secondary',
    className: 'section-block'
  }
];

// Footer navigation data
const footerNavigation = [
  { href: '#events', text: 'Events' },
  { href: '#verschenke', text: 'Verschenke' },
  { href: '#blog', text: 'Blog' },
  { href: '#hilfe', text: 'Hilfe' }
];

function LandingPage() {
  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-container">

      <ImageCarousel images={landingPhotos} />
      

      <section className="landing-content">
        <h1>Willkommen in Hand in Hand</h1>
        <p>Gemeinsam in der Nachbarschaft helfen und verbunden bleiben.</p>
        
        <div className="cta-buttons">

          <Link to="/register" className="btn primary">
            Jetzt Registrieren
          </Link>
          <Link to="/about" className="btn secondary">
            Mehr Erfahren
          </Link>
        </div>

        {/* Dynamic sections */}
        {sectionData.map((section) => (
          <section key={section.id} id={section.id} className={section.className}>
            <h2>{section.title}</h2>
            <img 
              src={section.image} 
              alt={section.imageAlt}
              loading="lazy" // Performance optimization
            />
            <p>{section.description}</p>
            <Link to={section.buttonLink} className={`btn ${section.buttonType}`}>
              {section.buttonText}
            </Link>
          </section>
        ))}

        {/* Help section - separate because of multiple paragraphs */}
        <section id="hilfe" className="section-block help-bg">
          <h2>🤝 Hilfe & Unterstützung</h2>
          <img 
            src={landingphoto4} 
            alt="Hilfe und Unterstützung"
            loading="lazy"
          />
          <p>Unsere Community steht dir bei Fragen und Anliegen zur Seite.</p>
          <p>Hier findest du Antworten auf häufige Fragen und kannst uns direkt kontaktieren.</p>
          <p>Brauchst du Hilfe oder Unterstützung? Wir sind für dich da.</p>
          <Link to="/help" className="btn primary">
            Hilfeseite öffnen
          </Link>
        </section>
        
        {/* Footer */}
        <Footer />
      </section>

    </div>
  );
}

export default LandingPage;


