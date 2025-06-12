//Brians Code
import React, { useState } from 'react';
//Dagmars Code
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import VerifyEmail from './components/VerifyEmail';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        adress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: parseInt(formData.zip)
        }
      })
    });
    const data = await response.json();
    alert(data.message);
    if (!data.error && data.token) {
      // Nach Registrierung direkt einloggen
      localStorage.setItem('token', data.token);
      // Nutzer-Daten holen
      const userRes = await fetch('http://localhost:3000/api/users/me', {
        headers: { 'Authorization': `Bearer ${data.token}` }
      });
      const userData = await userRes.json();
      onSuccess(userData); // auf Profil wechseln
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <nav>
        <Link to="/register">Registrieren</Link> |{' '}
        <Link to="/login">Login</Link> |{' '}
        <Link to="/profile">Profil</Link>
      </nav>
      <Routes>
        <Route path="/register" element={<Register onSuccess={setUser} />} />
        <Route path="/login" element={<Login onSuccess={setUser} />} />
        <Route path="/profile" element={<Profile user={user} setUser={setUser} onLogout={handleLogout} />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/" element={<Login onSuccess={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;


// Dagmars Code
// import { useState } from 'react'
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
// import './App.css'
// import VerifyEmail from './components/VerifyEmail'
// function App() {
//   const [count, setCount] = useState(0)
//   return (
//     <Router>
//       <Routes>
//         <Route path="/verify" element={<VerifyEmail />} />
//         <Route path="/" element={
//           <>
//             <div>
//               <a href="https://vite.dev" target="_blank">
//                 <img src={viteLogo} className="logo" alt="Vite logo" />
//               </a>
//               <a href="https://react.dev" target="_blank">
//                 <img src={reactLogo} className="logo react" alt="React logo" />
//               </a>
//             </div>
//             <h1>Hand-Hand Nachbarschafts-App</h1>
//             <div className="card">
//               <button onClick={() => setCount((count) => count + 1)}>
//                 count is {count}
//               </button>
//               <p>
//                 Edit <code>src/App.jsx</code> and save to test HMR
//               </p>
//             </div>
//             <p className="read-the-docs">
//               Klicke auf die Logos, um mehr zu erfahren
//             </p>
//           </>
//         } />
//       </Routes>
//     </Router>
//   )
// }
// export default App





//  import { useState } from 'react'
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import VerifyEmail from './components/VerifyEmail'
// function App() {
//   const [count, setCount] = useState(0)
//   return (
//     <Router>
//       <Routes>
//         <Route path="/verify" element={<VerifyEmail />} />
//         <Route path="/" element={
//           <>
//             <div>
//               <a href="https://vite.dev" target="_blank">
//                 <img src={viteLogo} className="logo" alt="Vite logo" />
//               </a>
//               <a href="https://react.dev" target="_blank">
//                 <img src={reactLogo} className="logo react" alt="React logo" />
//               </a>
//             </div>
//             <h1>Hand-Hand Nachbarschafts-App</h1>
//             <div className="card">
//               <button onClick={() => setCount((count) => count + 1)}>
//                 count is {count}
//               </button>
//               <p>
//                 Edit <code>src/App.jsx</code> and save to test HMR
//               </p>
//             </div>
//             <p className="read-the-docs">
//               Klicke auf die Logos, um mehr zu erfahren
//             </p>
//           </>
//         } />
//       </Routes>
//     </Router>
//   )
// }
// export default App
