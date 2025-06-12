import React, { useState } from 'react';

function Login({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'email') setEmail(e.target.value);
    if (e.target.name === 'password') setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        console.error('Server-Antwort ist kein gültiges JSON:', responseText);
        alert('Server gibt unerwartete Antwort zurück.');
        return;
      }

      if (response.ok && data.token) {
        alert('Login erfolgreich!');
        localStorage.setItem('token', data.token);
        // Nutzer-Daten holen
        const userRes = await fetch('http://localhost:4000/api/auth/users/me', {
          headers: { 'Authorization': `Bearer ${data.token}` }
        });
        const userData = await userRes.json();
        onSuccess(userData);
      } else {
        alert(data.message || 'Anmeldung fehlgeschlagen');
      }
    } catch (err) {
      console.error('Netzwerkfehler:', err);
      alert('Verbindung zum Server fehlgeschlagen.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={email}
        onChange={handleChange}
        required
      /><br />
      <input
        type="password"
        name="password"
        placeholder="Passwort"
        value={password}
        onChange={handleChange}
        required
      /><br />
      <button type="submit">Einloggen</button>
    </form>
  );
}

export default Login;