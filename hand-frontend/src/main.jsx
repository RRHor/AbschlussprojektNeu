import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Wir gehen davon aus, dass App.jsx existiert

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);