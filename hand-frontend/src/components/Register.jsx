import React, { useState } from 'react';

function Register({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    street: '',
    city: '',
    state: '',
    zip: ''
  });

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

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrierung</h2>
      <input placeholder="Name" onChange={(e) => handleChange({ target: { name: 'name', value: e.target.value } })} required /><br />
      <input placeholder="Email" type="email" onChange={(e) => handleChange({ target: { name: 'email', value: e.target.value } })} required /><br />
      <input placeholder="Passwort" type="password" onChange={(e) => handleChange({ target: { name: 'password', value: e.target.value } })} required /><br />
      <h3>Adresse</h3>
      <input placeholder="Straße" onChange={(e) => handleChange({ target: { name: 'street', value: e.target.value } })} required /><br />
      <input placeholder="Stadt" onChange={(e) => handleChange({ target: { name: 'city', value: e.target.value } })} required /><br />
      <input placeholder="Bundesland" onChange={(e) => handleChange({ target: { name: 'state', value: e.target.value } })} required /><br />
      <input placeholder="PLZ" type="number" onChange={(e) => handleChange({ target: { name: 'zip', value: e.target.value } })} required /><br />
      <button type="submit">Registrieren</button>
    </form>
  );
}

export default Register;