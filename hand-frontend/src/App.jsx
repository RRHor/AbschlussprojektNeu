

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail.jsx';
import EventRegister from './pages/EventRegister.jsx';
import Help from './pages/Help';
import Exchange from './pages/Exchange/Exchange';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword.jsx';
import Blog from './pages/Blog.jsx'; 
import Uberuns from './pages/Uberuns.jsx'; // Importiere die "Über uns" Seite
import Footer from './components/Footer.jsx'; // Importiere den Footer
import PageNotFound from './pages/PageNotFound.jsx'; // Importiere die 404-Seite
import VerifyEmail from './components/VerifyEmail.jsx';

function App() {

  return (
<>
    <Navbar /> {/* Die Navbar wird immer angezeigt, unabhängig von der Route */}
 
      
      
      <div className="container"> {/* Optional: Ein Container für deinen Seiteninhalt */}
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/help" element={<Help />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/register" element={<EventRegister />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/exchange/*" element={<Exchange />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/blogs" element={<Blog />} /> 
          <Route path="/profile" element={<Profile />} />
          <Route path="/uberuns" element={<Uberuns />} /> {/* Route für die "Über uns" Seite */}
          <Route path="*" element={<PageNotFound />} /> {/* Fallback für nicht gefundene Seiten */}
        </Routes>
      </div>
      <Footer />
     </>
  );
}
export default App;