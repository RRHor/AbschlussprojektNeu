
// Importiere andere Module NACH dotenv.config()
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import connectDB from './database/database.js';
import authRoutes from './routes/authRoutes.js';
import verifyRoutes from './routes/verifyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import adRoutes from './routes/adRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import adressRoutes from './routes/adressRoutes.js';
import testEmailRoutes from './routes/testEmailRoutes.js';
import postRoutes from './routes/postRoutes.js';
import passwordRequestRoute from './routes/passwordResetRequestRoute.js';
import passwordResetRoutes from './routes/passwordResetRoute.js';
import publicUserRoutes from './routes/publicUserRoutes.js';
import forgotRoute from './routes/forgotPasswordRoute.js'
import loginRoutes from './routes/loginRoutes.js';
import exchangeRoutes from './routes/exchangeRoutes.js';



// Lade Umgebungsvariablen aus .env-Datei
dotenv.config();


const app = express();
const PORT = process.env.PORT || 4000;

// Stelle Verbindung zur Datenbank her
connectDB();

// Mongoose Debug-Modus aktivieren
mongoose.set('debug', true);

// Middleware
app.use(cors());
app.use(express.json());

// Authentifizierungs-/Login-/Passwort-Routen
app.use('/api/auth', loginRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth', verifyRoutes);
app.use('/api/auth', passwordRequestRoute);
app.use('/api/auth', passwordResetRoutes);
app.use('/api/auth', forgotRoute);


// Test-Route zum Versenden von E-Mails
app.use('/api/test-email', testEmailRoutes);

// User-Routen
app.use('/api', userRoutes);
app.use('/api', publicUserRoutes);
app.use('/api', adressRoutes);

// Content-Routen
app.use('/api/blogs', blogRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/exchange', exchangeRoutes);


app.get('/', (req, res) => {
  res.send('Willkommen im "Hand in Hand"-Backend!');
});

// Starte den Server
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});

