import "./Footer.css"; // Importiere die CSS-Datei für den Footer

function Footer() {
  return (
    <div>
      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="/events">Events</a>
            <a href="/exchange">Verschenke</a>
            <a href="/blogs">Blog</a>
            <a href="/help">Hilfe</a>
            <a href="/uberuns">Über uns</a>
          </div>
          <p>
            &copy; {new Date().getFullYear()} Hand in Hand – Nachbarschaft verbindet. All rights reserved by Arben, Brian, Dagmar, Dominik, Nazli, Rea.
          </p>
        </div>
      </footer>
    </div>
  );
}
export default Footer;