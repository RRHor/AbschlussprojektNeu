import ImageCarousel from '../components/ImageCarousel';
import './LandingPage.css';
import React from 'react';

import landingphoto1 from '../assets/landingphoto/landingphoto1.png';
import landingphoto2 from '../assets/landingphoto/landingphoto2.png';
import landingphoto3 from '../assets/landingphoto/landingphoto3.png';
import landingphoto4 from '../assets/landingphoto/landingphoto4.png';
import landingphoto5 from '../assets/landingphoto/landingphoto5.avif'

const landingphoto = [
  landingphoto1,
  landingphoto2,
  landingphoto3,
  landingphoto4,
  landingphoto5,
];

function LandingPage() {
  return (
    <div className="landing-container">
      <ImageCarousel images={landingphoto} />
      <section className="landing-content">
        <h1>Willkommen in Hand in Hand</h1>
        <p>Gemeinsam in der Nachbarschaft helfen und verbunden bleiben.</p>
        <div className="cta-buttons">
          <a href="#!" className="btn primary">Jetzt Registieren</a>
          <a href="#!" className="btn secondary">Mehr Erfahren</a>
                  </div>
 {/* Events */}
      <section id="events" className="section-block section-colored">
        <h2>🎉 Events in deiner Nähe</h2>
        <img src={landingphoto1} alt="nachbarschafts-event" />
        <p>Entdecke lokale Veranstaltungen und triff Nachbarn.</p>
        <button className="btn primary">Alle Events ansehen</button>
      </section>

      {/* Verschenke */}
      <section id="verschenke" className="section-block">
        <h2>🎁 Verschenke & Tausche</h2>
        <img src={landingphoto2} alt="verschenke-event" />
        <p>Gib Dingen ein zweites Leben – verschenke oder tausche mit Nachbarn.</p>
        <button className="btn primary">Angebote ansehen</button>
      </section>

      {/* Blog */}
      <section id="blog" className="section-block section-colored">
        <h2>📝 Blog & Geschichten</h2>
        <img src={landingphoto3} alt="blog-event" />
        <p>Erfahre mehr über inspirierende Nachbarschaftsprojekte und Tipps.</p>
        <button className="btn primary">Zum Blog</button>
      </section>

      {/* Ask */}
      <section id="ask" className="section-block">
        <h2>❓ Häufige Fragen</h2>
        <img src={landingphoto5} alt="faq-event" />
        <p>Du hast Fragen? Wir haben Antworten für dich gesammelt.</p>
        <button className="btn secondary">Zu den FAQs</button>
      </section>

      {/* Hilfe */}
      <section id="hilfe" className="section-block help-bg">
        <h2>🤝 Hilfe & Unterstützung</h2>
        <img src={landingphoto4} alt="hilfe-event" />
        <p>Unsere Community steht dir bei Fragen und Anliegen zur Seite.</p>
        <p>Hier findest du Antworten auf häufige Fragen und kannst uns direkt kontaktieren.</p>
        <p>Brauchst du Hilfe oder Unterstützung? Wir sind für dich da.</p>
        <button className="btn primary">Hilfeseite öffnen</button>
      </section>
      
     {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#events">Events</a>
            <a href="#verschenke">Verschenke</a>
            <a href="#blog">Blog</a>
            <a href="#hilfe">Hilfe</a>
          </div>
     <p>&copy; {new Date().getFullYear()} Hand in Hand – Nachbarschaft verbindet. All rights reserved by Rea,Dominik,Nazli,Dogmar,Brian,Arben.</p>
  </div>
</footer>
      </section>
    </div>
  );
}

export default LandingPage;


