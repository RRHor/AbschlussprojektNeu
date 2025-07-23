import ResetPassword from "./components/ResetPassword.jsx";
<Route path="/reset-password" element={<ResetPassword />} />;

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/Home/LandingPage.jsx";
import Login from "./pages/Login-Register/Login.jsx";
import Register from "./pages/Login-Register/Register.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Help from "./pages/Help/Help.jsx";
import Blog from "./pages/Blog/Blog.jsx";
import Events from "./pages/Events/Events.jsx";
import EventDetail from "./pages/Events/EventDetail.jsx";
import EventRegister from "./pages/Events/EventRegister.jsx";
import Exchange from "./pages/Exchange/Exchange";
import ForgotPassword from "./components/ForgotPassword";
import Uberuns from "./pages/UberUns/Uberuns.jsx"; // Importiere die "Über uns" Seite
import Footer from "./components/Footer.jsx"; // Importiere den Footer
import PageNotFound from "./components/PageNotFound.jsx"; // Importiere die 404-Seite
import VerifyEmail from "./components/VerifyEmail.jsx";

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/help" element={<Help />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/register" element={<EventRegister />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/exchange/*" element={<Exchange />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/uberuns" element={<Uberuns />} />
          <Route path="*" element={<PageNotFound />} />{" "}
          {/* Fallback für nicht gefundene Seiten */}
          <Route path="/verify" element={<VerifyEmail />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
export default App;
