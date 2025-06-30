// server.js - Funktionsfähige Version
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';

// ES6 Module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env explizit laden
console.log('🔍 Loading .env from:', path.join(__dirname, '.env'));
const envResult = dotenv.config();

if (envResult.error) {
  console.error('❌ Failed to load .env file:', envResult.error);
  // Versuche alternative Pfade
  const altPath = path.resolve('.env');
  console.log('🔍 Trying alternative path:', altPath);
  dotenv.config({ path: altPath });
}

// Debug: Zeige geladene Environment Variables
console.log('🔍 Environment Variables Status:');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('MONGO_URI value:', process.env.MONGO_URI ? 'Set' : 'NOT SET');
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);

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
import exchangeRoutes from './routes/exchangeRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Stelle Verbindung zur Datenbank her
connectDB();

// Mongoose Debug-Modus aktivieren
mongoose.set('debug', true);

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Authentifizierungs-Routen
app.use('/api/auth', authRoutes);
app.use('/api/auth', verifyRoutes);
app.use('/api/auth', passwordRequestRoute);
app.use('/api/auth', passwordResetRoutes);

// Test-Route zum Versenden von E-Mails
app.use('/api/test-email', testEmailRoutes);

// User-Routen
app.use('/api', userRoutes);
app.use('/api', adressRoutes);

// Content-Routen
app.use('/api/blogs', blogRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/exchange', exchangeRoutes);

// Root-Route
app.get('/', (req, res) => {
  res.send('Willkommen im "Hand in Hand"-Backend!');
});

// Starte den Server
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});

