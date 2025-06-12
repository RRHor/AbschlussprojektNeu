# seed.js

```
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/UserModel.js';
import Adress from './models/AdressModel.js';
import userData from './data/seedUsers.json' assert { type: 'json' };
import adressData from './data/seedAdresses.json' assert { type: 'json' };

dotenv.config();

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ MongoDB connected');

        // Bestehende Daten löschen
        await User.deleteMany({});
        await Adress.deleteMany({});
        console.log('🗑️ Existing data cleared');

        // Adressen einfügen
        const insertedAdresses = await Adress.insertMany(adressData);
        console.log(`📦 ${insertedAdresses.length} addresses inserted`);

        // Benutzer vorbereiten: Adressen zufällig zuweisen
        const usersWithAdress = userData.map((user) => {
            const randomAdress = insertedAdresses[Math.floor(Math.random() * insertedAdresses.length)];
            return {
                ...user,
                adress: randomAdress._id
            };
        });

        // Benutzer einfügen
        await User.insertMany(usersWithAdress);
        console.log(`👤 ${usersWithAdress.length} users inserted`);

        console.log('✅ Seeding finished!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedDatabase();

```

# seedAdresses.json

```
[
  { "street": "Karl-Marx-Allee 1", "city": "Berlin", "state": "Berlin", "zipCode": 10178, "country": "Germany" },
  { "street": "Alexanderplatz 5", "city": "Berlin", "state": "Berlin", "zipCode": 10178, "country": "Germany" },
  { "street": "Friedrichstraße 43", "city": "Berlin", "state": "Berlin", "zipCode": 10117, "country": "Germany" },
  { "street": "Unter den Linden 12", "city": "Berlin", "state": "Berlin", "zipCode": 10117, "country": "Germany" },
  { "street": "Schönhauser Allee 80", "city": "Berlin", "state": "Berlin", "zipCode": 10439, "country": "Germany" },
  { "street": "Prenzlauer Allee 22", "city": "Berlin", "state": "Berlin", "zipCode": 10405, "country": "Germany" },
  { "street": "Torstraße 55", "city": "Berlin", "state": "Berlin", "zipCode": 10119, "country": "Germany" },
  { "street": "Invalidenstraße 120", "city": "Berlin", "state": "Berlin", "zipCode": 10115, "country": "Germany" },
  { "street": "Chausseestraße 101", "city": "Berlin", "state": "Berlin", "zipCode": 10115, "country": "Germany" },
  { "street": "Ackerstraße 3", "city": "Berlin", "state": "Berlin", "zipCode": 10115, "country": "Germany" },

  { "street": "Kurfürstendamm 12", "city": "Berlin", "state": "Berlin", "zipCode": 10719, "country": "Germany" },
  { "street": "Wilmersdorfer Straße 50", "city": "Berlin", "state": "Berlin", "zipCode": 10627, "country": "Germany" },
  { "street": "Tauentzienstraße 9", "city": "Berlin", "state": "Berlin", "zipCode": 10789, "country": "Germany" },
  { "street": "Uhlandstraße 25", "city": "Berlin", "state": "Berlin", "zipCode": 10719, "country": "Germany" },
  { "street": "Blissestraße 17", "city": "Berlin", "state": "Berlin", "zipCode": 10713, "country": "Germany" },
  { "street": "Hohenzollerndamm 45", "city": "Berlin", "state": "Berlin", "zipCode": 10713, "country": "Germany" },
  { "street": "Bundesallee 20", "city": "Berlin", "state": "Berlin", "zipCode": 10717, "country": "Germany" },
  { "street": "Leibnizstraße 34", "city": "Berlin", "state": "Berlin", "zipCode": 10625, "country": "Germany" },
  { "street": "Otto-Suhr-Allee 100", "city": "Berlin", "state": "Berlin", "zipCode": 10585, "country": "Germany" },
  { "street": "Kaiserdamm 22", "city": "Berlin", "state": "Berlin", "zipCode": 14057, "country": "Germany" },

  { "street": "Potsdamer Straße 3", "city": "Berlin", "state": "Berlin", "zipCode": 10785, "country": "Germany" },
  { "street": "Glinkastraße 5", "city": "Berlin", "state": "Berlin", "zipCode": 10117, "country": "Germany" },
  { "street": "Leipziger Straße 120", "city": "Berlin", "state": "Berlin", "zipCode": 10117, "country": "Germany" },
  { "street": "Mauerstraße 45", "city": "Berlin", "state": "Berlin", "zipCode": 10117, "country": "Germany" },
  { "street": "Mohrenstraße 60", "city": "Berlin", "state": "Berlin", "zipCode": 10117, "country": "Germany" },
  { "street": "Oranienburger Straße 33", "city": "Berlin", "state": "Berlin", "zipCode": 10117, "country": "Germany" },
  { "street": "Fasanenstraße 12", "city": "Berlin", "state": "Berlin", "zipCode": 10719, "country": "Germany" },
  { "street": "Lietzenburger Straße 50", "city": "Berlin", "state": "Berlin", "zipCode": 10789, "country": "Germany" },
  { "street": "Bleibtreustraße 40", "city": "Berlin", "state": "Berlin", "zipCode": 10623, "country": "Germany" },
  { "street": "Hardenbergstraße 15", "city": "Berlin", "state": "Berlin", "zipCode": 10623, "country": "Germany" },
  { "street": "Steglitzer Damm 55", "city": "Berlin", "state": "Berlin", "zipCode": 12169, "country": "Germany" },

  { "street": "Schloßstraße 34", "city": "Berlin", "state": "Berlin", "zipCode": 12163, "country": "Germany" },
  { "street": "Rathausstraße 2", "city": "Berlin", "state": "Berlin", "zipCode": 12105, "country": "Germany" },
  { "street": "Mariendorfer Damm 75", "city": "Berlin", "state": "Berlin", "zipCode": 12107, "country": "Germany" },
  { "street": "Alt-Moabit 90", "city": "Berlin", "state": "Berlin", "zipCode": 10559, "country": "Germany" },
  { "street": "Turmstraße 25", "city": "Berlin", "state": "Berlin", "zipCode": 10559, "country": "Germany" },
  { "street": "Wilsnacker Straße 40", "city": "Berlin", "state": "Berlin", "zipCode": 10559, "country": "Germany" },
  { "street": "Stromstraße 47", "city": "Berlin", "state": "Berlin", "zipCode": 10555, "country": "Germany" },
  { "street": "Perleberger Straße 10", "city": "Berlin", "state": "Berlin", "zipCode": 10559, "country": "Germany" },
  { "street": "Osnabrücker Straße 12", "city": "Berlin", "state": "Berlin", "zipCode": 10559, "country": "Germany" },
  { "street": "Quitzowstraße 40", "city": "Berlin", "state": "Berlin", "zipCode": 10559, "country": "Germany" }
]

```

# seedUsers.json

```
[
  { "userID": 1, "email": "anna.petrova@example.com", "password": "Test1234!", "userName": "anna.petrova", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 2, "email": "omar.elmasri@example.com", "password": "Test1234!", "userName": "omar.elmasri", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 3, "email": "lucia.gonzalez@example.com", "password": "Test1234!", "userName": "lucia.gonzalez", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 4, "email": "david.cohen@example.com", "password": "Test1234!", "userName": "david.cohen", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 5, "email": "marie.dubois@example.com", "password": "Test1234!", "userName": "marie.dubois", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 6, "email": "li.wei@example.com", "password": "Test1234!", "userName": "li.wei", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 7, "email": "youssef.abdallah@example.com", "password": "Test1234!", "userName": "youssef.abdallah", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 8, "email": "sofia.rossi@example.com", "password": "Test1234!", "userName": "sofia.rossi", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 9, "email": "peter.mueller@example.com", "password": "Test1234!", "userName": "peter.mueller", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 10, "email": "emily.johnson@example.com", "password": "Test1234!", "userName": "emily.johnson", "isActive": true, "isAdmin": false, "isVerified": false },

  { "userID": 11, "email": "mohammed.ahmed@example.com", "password": "Test1234!", "userName": "mohammed.ahmed", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 12, "email": "maria.fernandez@example.com", "password": "Test1234!", "userName": "maria.fernandez", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 13, "email": "hiroshi.tanaka@example.com", "password": "Test1234!", "userName": "hiroshi.tanaka", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 14, "email": "nina.schmidt@example.com", "password": "Test1234!", "userName": "nina.schmidt", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 15, "email": "alexander.ivanov@example.com", "password": "Test1234!", "userName": "alexander.ivanov", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 16, "email": "sara.kim@example.com", "password": "Test1234!", "userName": "sara.kim", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 17, "email": "ahmed.khan@example.com", "password": "Test1234!", "userName": "ahmed.khan", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 18, "email": "julien.moreau@example.com", "password": "Test1234!", "userName": "julien.moreau", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 19, "email": "chloe.smith@example.com", "password": "Test1234!", "userName": "chloe.smith", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 20, "email": "luca.bianchi@example.com", "password": "Test1234!", "userName": "luca.bianchi", "isActive": true, "isAdmin": false, "isVerified": false },

  { "userID": 21, "email": "johan.olsson@example.com", "password": "Test1234!", "userName": "johan.olsson", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 22, "email": "fatima.hassan@example.com", "password": "Test1234!", "userName": "fatima.hassan", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 23, "email": "michael.brown@example.com", "password": "Test1234!", "userName": "michael.brown", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 24, "email": "olga.smirnova@example.com", "password": "Test1234!", "userName": "olga.smirnova", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 25, "email": "daniel.fischer@example.com", "password": "Test1234!", "userName": "daniel.fischer", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 26, "email": "isabella.martinez@example.com", "password": "Test1234!", "userName": "isabella.martinez", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 27, "email": "sebastian.schneider@example.com", "password": "Test1234!", "userName": "sebastian.schneider", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 28, "email": "yasmin.ali@example.com", "password": "Test1234!", "userName": "yasmin.ali", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 29, "email": "tomislav.nikolic@example.com", "password": "Test1234!", "userName": "tomislav.nikolic", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 30, "email": "anastasia.kuznetsova@example.com", "password": "Test1234!", "userName": "anastasia.kuznetsova", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 31, "email": "pedro.silva@example.com", "password": "Test1234!", "userName": "pedro.silva", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 32, "email": "hannah.wilson@example.com", "password": "Test1234!", "userName": "hannah.wilson", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 33, "email": "abdullah.karim@example.com", "password": "Test1234!", "userName": "abdullah.karim", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 34, "email": "laura.novak@example.com", "password": "Test1234!", "userName": "laura.novak", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 35, "email": "giulia.moretti@example.com", "password": "Test1234!", "userName": "giulia.moretti", "isActive": true, "isAdmin": false, "isVerified": false },

  { "userID": 36, "email": "steven.wright@example.com", "password": "Test1234!", "userName": "steven.wright", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 37, "email": "elena.popescu@example.com", "password": "Test1234!", "userName": "elena.popescu", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 38, "email": "lucas.garcia@example.com", "password": "Test1234!", "userName": "lucas.garcia", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 39, "email": "sven.larsson@example.com", "password": "Test1234!", "userName": "sven.larsson", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 40, "email": "mei.chen@example.com", "password": "Test1234!", "userName": "mei.chen", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 41, "email": "ali.hussein@example.com", "password": "Test1234!", "userName": "ali.hussein", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 42, "email": "noura.salem@example.com", "password": "Test1234!", "userName": "noura.salem", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 43, "email": "samuel.bernard@example.com", "password": "Test1234!", "userName": "samuel.bernard", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 44, "email": "natalia.kowalska@example.com", "password": "Test1234!", "userName": "natalia.kowalska", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 45, "email": "andreas.papadopoulos@example.com", "password": "Test1234!", "userName": "andreas.papadopoulos", "isActive": true, "isAdmin": false, "isVerified": false },

  { "userID": 46, "email": "emir.dogan@example.com", "password": "Test1234!", "userName": "emir.dogan", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 47, "email": "sophia.kimura@example.com", "password": "Test1234!", "userName": "sophia.kimura", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 48, "email": "ivan.petrov@example.com", "password": "Test1234!", "userName": "ivan.petrov", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 49, "email": "lina.foster@example.com", "password": "Test1234!", "userName": "lina.foster", "isActive": true, "isAdmin": false, "isVerified": false },
  { "userID": 50, "email": "hassan.youssef@example.com", "password": "Test1234!", "userName": "hassan.youssef", "isActive": true, "isAdmin": false, "isVerified": false }
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

