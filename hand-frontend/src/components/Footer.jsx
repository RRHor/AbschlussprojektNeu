import "./Footer.css"; // Importiere die CSS-Datei für den Footer

function Footer() {
  return (
    <div>
      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="/events">Events</a>
            <a href="/verschenke">Verschenke</a>
            <a href="/blog">Blog</a>
            <a href="/hilfe">Hilfe</a>
            <a href="/uberuns">Über uns</a>
          </div>
          <p>
            &copy; {new Date().getFullYear()} Hand in Hand – Nachbarschaft verbindet. All rights reserved by Rea,Dominik,Nazli,Dogmar,Brian,Arben.
          </p>
        </div>
      </footer>
    </div>
  );
}
export default Footer;