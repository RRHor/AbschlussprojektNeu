# Hand in Hand – Nachbarschaftshilfe Plattform

## Projektübersicht

"Hand in Hand" ist eine Webanwendung zur Förderung von Nachbarschaftshilfe. Nutzer können Beiträge erstellen, tauschen, verschenken, suchen, an Events teilnehmen, Blog-Kommentare schreiben und vieles mehr. Die Plattform bietet Authentifizierung, Passwort-Reset, E-Mail-Verifizierung und ein modernes, responsives UI.

---

## Techstack

### Frontend
- **Framework:** React (mit Vite)
- **Sprache:** JavaScript (ES6+)
- **Styling:** CSS-Module, Custom CSS-Variablen, Responsive Design
- **State Management:** React Context API
- **Routing:** React Router
- **Build Tool:** Vite
- **Weitere Tools:**
  - Axios (API-Requests)
  - React Icons

### Backend
- **Framework:** Node.js mit Express
- **Sprache:** JavaScript (ES6+)
- **Datenbank:** MongoDB (mit Mongoose ODM)
- **Authentifizierung:** JWT (JSON Web Token), Cookies
- **E-Mail:** Nodemailer (z.B. für Verifizierung und Passwort-Reset)
- **CORS:** Flexible Konfiguration für lokale Entwicklung
- **Weitere Tools:**
  - dotenv (Umgebungsvariablen)
  - cookie-parser

### Sonstiges
- **Entwicklung:**
  - Git & GitHub (Branch-Workflow, Pull Requests)
  - Debug-Logging für Requests und Umgebungsvariablen
- **Deployment:**
  - (Platzhalter für zukünftiges Deployment, z.B. Vercel/Heroku)

---

## Projektstruktur (Auszug)

```
hand-frontend/
  src/
    components/        # Wiederverwendbare UI-Komponenten
    context/           # React Context (z.B. AuthContext)
    pages/             # Seiten (Profile, Exchange, Blog, Events, etc.)
    assets/            # Bilder, Icons, etc.
  public/
  package.json
  vite.config.js

hand-backend/
  models/              # Mongoose-Modelle
  routes/              # Express-Routen
  middleware/          # Authentifizierungs-Middleware
  utils/               # Hilfsfunktionen (z.B. E-Mail)
  database/            # DB-Verbindung
  server.js            # Einstiegspunkt Backend
  package.json

README.md
```

---

## Setup & Entwicklung

### Voraussetzungen
- Node.js (empfohlen: v18+)
- MongoDB (lokal oder Cloud)

### Installation

1. **Backend installieren:**
   ```bash
   cd hand-backend
   npm install
   # .env Datei anlegen (siehe .env.example)
   npm run dev
   ```
2. **Frontend installieren:**
   ```bash
   cd hand-frontend
   npm install
   npm run dev
   ```

### Wichtige Umgebungsvariablen (Backend)
- `MONGO_URI` – MongoDB-Verbindungsstring
- `JWT_SECRET` – Secret für Token
- `FRONTEND_URL` – Erlaubte Origin(s) für CORS
- `EMAIL_USER`/`EMAIL_PASS` – SMTP für E-Mail-Versand

---

## Features
- Registrierung, Login, E-Mail-Verifizierung
- Passwort-Reset via E-Mail
- Beiträge: Verschenken, Tauschen, Suchen
- Blog-Kommentare, Event-Kommentare
- Events erstellen und kommentieren
- Moderner, responsiver Look (Darkmode-Support)
- Eigene Beiträge im Profil verwalten
- Sicheres API-Design (JWT, Cookies, CORS)

---

## Mitwirken

1. Forke das Repository
2. Erstelle einen Branch (`git checkout -b feature/xyz`)
3. Committe und pushe deine Änderungen
4. Erstelle einen Pull Request

---

## Lizenz
MIT License

---



## Projektstart & Setup
1️⃣ Repository clonen
`git clone <REPO-URL>`
`cd backend`

2️⃣ Abhängigkeiten installieren
`npm install`

3️⃣ Umgebungsvariablen einrichten
.env Datei anlegen:
`MONGO_URL=mongodb://localhost:27017/nachbarschaftshilfe`

4️⃣ Datenbank befüllen (Seed)
`npm run seed`

## 👫 Team

Arben

Nazli

Dominik

Dagmar

Brian

Rea

## Kontakt
Für Fragen oder Feedback: [GitHub Issues](https://github.com/RRHor/AbschlussprojektNeu/issues)

## Hinweise

Entwicklung aktuell lokal auf MongoDB

Später: Deployment auf Cloud (z.B. Atlas, Render, Railway)

