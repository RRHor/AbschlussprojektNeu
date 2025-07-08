import { Routes, Route, NavLink } from 'react-router-dom';
import Verschenken from './Verschenken.jsx';
import Tauschen from './Tauschen.jsx';
import Suchen from './Suchen.jsx';
import Hilfe from './Hilfe.jsx';
import './Exchange.css';

const Exchange = () => {
  return (
    <div className="exchange-page">
      <Routes>
        {/* Hauptansicht mit 4 Kacheln */}
        <Route
          index
          element={
            <div className="exchange-grid">
              <NavLink to="verschenken" className="exchange-box verschenken-box">
                🎁<span>Verschenken</span>
              </NavLink>
              <NavLink to="tauschen" className="exchange-box tauschen-box">
                🔁<span>Tauschen</span>
              </NavLink>
              <NavLink to="suchen" className="exchange-box suchen-box">
                🔍<span>Suchen</span>
              </NavLink>
              <NavLink to="hilfe" className="exchange-box hilfe-box">
                ❓<span>Hilfe</span>
              </NavLink>
            </div>
          }
        />
        {/* Unterseiten */}
        <Route path="verschenken" element={<Verschenken />} />
        <Route path="tauschen" element={<Tauschen />} />
        <Route path="suchen" element={<Suchen />} />
        <Route path="hilfe" element={<Hilfe />} />
      </Routes>
    </div>
  );
};

export default Exchange;
