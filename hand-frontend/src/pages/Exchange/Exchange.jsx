import { Routes, Route, NavLink } from 'react-router-dom';
import Verschenken from './Verschenken.jsx';
import Tauschen from './Tauschen.jsx';
import Suchen from './Suchen.jsx';
import './Exchange.css'; // Importiere die CSS-Datei für das Styling

const Exchange = () => {
  return (
    <div className="exchange-page">
      <h1>🎁 Verschenken & Tauschen</h1>

      <nav className="exchange-nav">
        <NavLink to="verschenken" className={({ isActive }) => isActive ? "active" : ""}>Verschenken</NavLink>
        <NavLink to="tauschen" className={({ isActive }) => isActive ? "active" : ""}>Tauschen</NavLink>
        <NavLink to="suchen" className={({ isActive }) => isActive ? "active" : ""}>Suchen</NavLink>
      </nav>

      <div className="exchange-content">
        <Routes>
          <Route path="/" element={<p>Wähle eine Kategorie!</p>} />
          <Route path="verschenken" element={<Verschenken />} />
          <Route path="tauschen" element={<Tauschen />} />
          <Route path="suchen" element={<Suchen />} />
        </Routes>
      </div>
    </div>
  );
};

export default Exchange;
