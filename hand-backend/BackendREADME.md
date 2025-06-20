# seed.js

```
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import User from '../models/UserModel.js';

// ✅ MongoDB URI (z.B. aus .env laden oder hier festlegen)
const MONGO_URI = 'mongodb://127.0.0.1:27017/nachbarschaftshilfe';  // <--- anpassen!

// ✅ Verbindung zu MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB verbunden');
  } catch (error) {
    console.error('❌ Fehler bei MongoDB Verbindung:', error);
    process.exit(1);
  }
};

// ✅ Seed-Funktion
const seedUsers = async () => {
  try {
    const filePath = path.resolve('./seeder/seedUsers.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const users = JSON.parse(data);

    // Datenbank leeren
    await User.deleteMany();
    console.log('🗑️ Vorherige User gelöscht');

    // User mit gehashten Passwörtern erstellen
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    // User speichern
    await User.insertMany(hashedUsers);
    console.log('✅ Neue User erfolgreich eingefügt!');
    process.exit();
  } catch (error) {
    console.error('❌ Fehler beim Seeden:', error);
    process.exit(1);
  }
};

// ✅ Ablauf starten
await connectDB();
await seedUsers();
```
ausführen mit: `node seeder/seed.js` (wenn seed.js in Ordner 'seeder' in 'hand-backend' liegt)

# seedUser.json

```
[
  {
    "name": "Ali Mahmoud",
    "address": {
      "street": "Warschauer Straße 34",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10243
    },
    "email": "ali.mahmoud@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Sophie Dubois",
    "address": {
      "street": "Torstraße 189",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10115
    },
    "email": "sophie.dubois@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Fatima Al-Hassan",
    "address": {
      "street": "Boxhagener Straße 82",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10245
    },
    "email": "fatima.alhassan@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Kenji Tanaka",
    "address": {
      "street": "Kantstraße 55",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10625
    },
    "email": "kenji.tanaka@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Carlos García",
    "address": {
      "street": "Karl-Marx-Allee 78",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10243
    },
    "email": "carlos.garcia@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Sara Cohen",
    "address": {
      "street": "Leipziger Straße 125",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10117
    },
    "email": "sara.cohen@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Nguyen Minh",
    "address": {
      "street": "Frankfurter Allee 60",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10247
    },
    "email": "nguyen.minh@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Viktor Ivanov",
    "address": {
      "street": "Prenzlauer Allee 185",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10405
    },
    "email": "viktor.ivanov@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Zeynep Yilmaz",
    "address": {
      "street": "Kottbusser Damm 24",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10967
    },
    "email": "zeynep.yilmaz@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "David Johnson",
    "address": {
      "street": "Hermannstraße 150",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 12051
    },
    "email": "david.johnson@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Maria Rossi",
    "address": {
      "street": "Brunnenstraße 45",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10115
    },
    "email": "maria.rossi@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Omar El-Sayed",
    "address": {
      "street": "Karl-Marx-Straße 90",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 12043
    },
    "email": "omar.elsayed@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Elena Petrova",
    "address": {
      "street": "Greifswalder Straße 155",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10409
    },
    "email": "elena.petrova@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Isaac Levy",
    "address": {
      "street": "Oranienburger Straße 70",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10117
    },
    "email": "isaac.levy@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Chen Wei",
    "address": {
      "street": "Adalbertstraße 7",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10999
    },
    "email": "chen.wei@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Sofia Hernandez",
    "address": {
      "street": "Urbanstraße 120",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10967
    },
    "email": "sofia.hernandez@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Mohammed Khan",
    "address": {
      "street": "Hasenheide 18",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10967
    },
    "email": "mohammed.khan@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Emma Wilson",
    "address": {
      "street": "Chausseestraße 36",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10115
    },
    "email": "emma.wilson@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Youssef Benali",
    "address": {
      "street": "Kurfürstenstraße 112",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10785
    },
    "email": "youssef.benali@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Aylin Demir",
    "address": {
      "street": "Seestraße 55",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 13347
    },
    "email": "aylin.demir@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Andrei Popescu",
    "address": {
      "street": "Schönhauser Allee 50",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10437
    },
    "email": "andrei.popescu@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Leila Haddad",
    "address": {
      "street": "Mehringdamm 32",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10961
    },
    "email": "leila.haddad@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Mateusz Kowalski",
    "address": {
      "street": "Pappelallee 15",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10437
    },
    "email": "mateusz.kowalski@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Amira Osman",
    "address": {
      "street": "Gneisenaustraße 20",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10961
    },
    "email": "amira.osman@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Luca Conti",
    "address": {
      "street": "Danziger Straße 45",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10435
    },
    "email": "luca.conti@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Nina Müller",
    "address": {
      "street": "Invalidenstraße 120",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10115
    },
    "email": "nina.mueller@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Artem Ivanov",
    "address": {
      "street": "Berliner Allee 35",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 13088
    },
    "email": "artem.ivanov@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Aisha Malik",
    "address": {
      "street": "Reuterstraße 67",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 12047
    },
    "email": "aisha.malik@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Jin Park",
    "address": {
      "street": "Schlesische Straße 27",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 10997
    },
    "email": "jin.park@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  },
  {
    "name": "Isabella Santos",
    "address": {
      "street": "Sonnenallee 112",
      "city": "Berlin",
      "state": "Berlin",
      "zip": 12045
    },
    "email": "isabella.santos@example.com",
    "password": "123456",
    "isAdmin": false,
    "isActive": true,
    "verificationCode": null,
    "verificationCodeExpires": null
  }
]
```

# 🏡 Nachbarschaftshilfe Plattform - Backend
Fullstack-Projekt im Rahmen des DCI-Abschlussprojekts
Backend-Teil (Node.js, Express, MongoDB, Mongoose, ESM)

## 📦 Tech-Stack
Node.js (ESM / modern JS)

Express.js (wird noch aufgebaut)

MongoDB + Mongoose

dotenv (Umgebungsvariablen)

Seed-Skript zum Befüllen mit Testdaten

## 🚀 Projektstart & Setup
#### 1️⃣ Repository clonen
`git clone <REPO-URL>`
`cd backend`

#### 2️⃣ Abhängigkeiten installieren
`npm install`

#### 3️⃣ Umgebungsvariablen einrichten
.env Datei anlegen:
`MONGO_URL=mongodb://localhost:27017/nachbarschaftshilfe`

#### 4️⃣ Datenbank befüllen (Seed)

`npm run seed`

##### Ergebnis:

Bestehende Daten werden gelöscht.

Neue Testdaten (Users + Adressen) werden eingefügt.

#### 🌱 Was ist das Seed-Skript?
Das Seed-Skript befüllt automatisch die MongoDB mit Testdaten, um die Entwicklung & das Testen zu erleichtern.

✅ 50 User werden generiert

✅ Adressen sind realistisch & international gemischt

✅ User und Adressen sind verknüpft

##### Vorteil fürs Team:
Alle arbeiten mit denselben Testdaten

Frontend kann sofort mit echten Daten arbeiten

Seed jederzeit wiederholbar

Seed erneut ausführen:
`npm run seed`

## 🔧 Ordnerstruktur

/backend
│
├── /models          # Mongoose Models (User, Adress)
├── /data            # Seed-Daten (JSON)
├── .env             # Umgebungsvariablen
├── package.json     # NPM Konfiguration (inkl. "type": "module")
├── seed.js          # Seed-Skript
└── README.md        # Projektdokumentation

## 📅 Zeitplan (Backend-Team 2-3 Personen)
| Phase             | Zeitraum    | Aufgaben                        |
|-------------------|-------------|---------------------------------|
| Setup & Planung   | Tag 1-2     | Projektstruktur, Models         |
| Seed erstellen    | Tag 3-4     | Seed-Skripte & Testdaten        |
| API entwickeln    | Tag 5-15    | Routen, Auth, Logik             |
| Testing           | Tag 16-20   | Fehlerbehebung, Tests           |
| Optimierung       | Tag 21-22   | Refactoring, Clean Code         |
| Dokumentation     | Tag 23      | README, API-Doku                |
| Präsentation      | Tag 24      | Demo & Abgabe                   |

## 🔐 API Routen (geplant)
Route	Methode	Beschreibung
/api/users	GET	Liste aller User
/api/users/:id	GET	Userdetails anzeigen
/api/adresses	GET	Liste aller Adressen
/api/register	POST	Neuen User registrieren
/api/login	POST	User Login

## 👫 Team
Arben, Briean, Dominik, Nazli, Dagmar, Rea

## 📌 Hinweise
Entwicklung aktuell lokal auf MongoDB

Später: Deployment auf Cloud (z.B. Atlas, Render, Railway)

Seed-Skript nur für Entwicklung verwenden!

FUNKTIONIERT DIE SOURCECONTROL NUN FEHLERLOS?



Hallo Test