import React, { useEffect, useState } from 'react';

function Profile({ user, setUser, onLogout }) {
  const token = localStorage.getItem('token');

  const [localUser, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Daten beim Laden laden
  useEffect(() => {
    fetch('http://localhost:4000/api/auth/users/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setLocalUser(data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Fehler beim Profil Laden:', err);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Daten werden geladen...</p>;
  if (!localUser) return <p>Fehler: Nutzer nicht gefunden</p>;

  // Änderungen
  const handleChange = (e) => {
    const { name, value } = e.target;
    // adress-Felder, falls nötig
    if (name.startsWith('adress.')) {
      const field = name.split('.')[1];
      setLocalUser({
        ...localUser,
        adress: { ...localUser.adress, [field]: value }
      });
    } else {
      setLocalUser({
        ...localUser,
        [name]: value
      });
    }
  };

  // Daten speichern
  const handleSave = () => {
    fetch(`http://localhost:4000/api/auth/users/${localUser._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(localUser),
    })
    .then(res => res.json())
    .then(data => {
      alert('Daten aktualisiert!');
      setUser(data); // oberes State updaten
    })
    .catch(err => console.error('Fehler beim Speichern:', err));
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Mein Profil</h2>
      <div>
        <label>Name:</label><br />
        <input name="name" value={localUser.name} onChange={handleChange} /><br />
      </div>
      <div>
        <label>Email (nur lesen):</label><br />
        <input name="email" value={localUser.email} readOnly /><br />
      </div>
      <h3>Adresse</h3>
      <div>
        <label>Straße:</label><br />
        <input
          name="adress.street"
          value={localUser.adress.street}
          onChange={handleChange}
        /><br />
      </div>
      <div>
        <label>Stadt:</label><br />
        <input
          name="adress.city"
          value={localUser.adress.city}
          onChange={handleChange}
        /><br />
      </div>
      <div>
        <label>Bundesland:</label><br />
        <input
          name="adress.state"
          value={localUser.adress.state}
          onChange={handleChange}
        /><br />
      </div>
      <div>
        <label>PLZ:</label><br />
        <input
          name="adress.zip"
          type="number"
          value={localUser.adress.zip}
          onChange={(e) => handleChange({ target: { name: 'adress.zip', value: e.target.value } })}
        /><br />
      </div>
      <button onClick={handleSave}>Änderungen speichern</button>
      <button onClick={onLogout} style={{ marginLeft: '10px' }}>Abmelden</button>
    </div>
  );
}

export default Profile;