import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

import connectDB from './database/database.js';
import authRoutes from './routes/authRoutes.js';
import verifyRoutes from './routes/verifyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import adRoutes from './routes/adRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import adressRoutes from './routes/adressRoutes.js';
import testEmailRoutes from './routes/testEmailRoutes.js'
import postRoutes from './routes/postRoutes.js';
import passwordRequestRoute from './routes/passwordResetRequestRoute.js';
import passwordResetRoutes from './routes/passwordResetRoute.js';
import publicUserRoutes from './routes/publicUserRoutes.js';



// Lade Umgebungsvariablen aus .env-Datei
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Stelle Verbindung zur Datenbank her
connectDB();

// Middleware für CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Middleware zum Parsen von JSON-Bodies
app.use(express.json());

// Middleware zum Parsen von Cookies
app.use(cookieParser());

// Authentifizierungs-Routen (Registrierung, Login, Verifizierung)
app.use('/api/auth', authRoutes);

// Test-Route zum Versenden von E-Mails
app.use('/api/test-email', testEmailRoutes);

// Verifizierungs-Routen (z.B. /api/auth/verify)
app.use('/api', verifyRoutes);

// User-Routen (z.B. /api/users/me, /api/users/:id)
app.use('/api', userRoutes);

// Blog-Routen (z.B. /api/blog)
app.use('/api/blogs', blogRoutes);

// Kleinanzeigen-Routen (z.B. /api/ads)
app.use('/api/ads', adRoutes);

// Event-Routen (z.B. /api/events)
app.use('/api/events', eventRoutes);

// Kommentar-Routen (z.B. /api/comments)
app.use('/api/comments', commentRoutes);

// Adress-Routen (z.B. /api/users/me/adress)
app.use('/api', adressRoutes);

// Post-Routen (z.B. /api/posts)
app.use('/api/posts', postRoutes);

// Passwort-Zurücksetzen-Routen (z.B. /api/password-reset)
app.use('/api/auth', passwordRequestRoute);

app.use('/api/auth', passwordResetRoutes);

// User sucht User
app.use('/api', publicUserRoutes);

// Root-Route (Startseite)
app.get('/', (req, res) => {
  res.send('Willkommen im "Hand in Hand"-Backend!');
});

// Starte den Server
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

