// server.js - Saubere Version mit allen Imports oben
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';
// Dotenv zuerst laden
dotenv.config();

// // Debug: Überprüfe ob .env geladen wurde
// console.log('🔧 .env loaded - MONGODB_URI exists:', !!process.env.MONGODB_URI);
// console.log('🔧 PORT:', process.env.PORT);

// SOFORT dotenv laden - vor allen anderen Imports
dotenv.config();

// Alle Standard-Imports
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

// Alle Route-Imports 
import connectDB from './database/database.js';
import { userSchema } from "./models/userSchema.js";
import authRoutes from './routes/authRoutes.js';
import verifyRoutes from './routes/verifyRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import blogCommentRoutes from './routes/blogCommentRoutes.js';
import adRoutes from './routes/adRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import eventCommentRoutes from './routes/eventCommentRoutes.js';
import postRoutes from './routes/postRoutes.js';
import passwordResetRequestRoute from './routes/passwordResetRequestRoute.js';
import passwordResetRoute from './routes/passwordResetRoute.js';
import publicUserRoutes from './routes/publicUserRoutes.js';
import exchangeRoutes from './routes/exchangeRoutes.js';
import helpQuestionRoutes from './routes/helpQuestionRoutes.js';
import helpAnswerRoutes from './routes/helpAnswerRoutes.js';
import userRoutes from './routes/userRoutes.js';


const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

// Registriere das User-Modell mit deinem Schema, falls noch nicht geschehen
if (!mongoose.models.User) {
  mongoose.model("User", userSchema);
}

// ES6 Module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug Environment Variables
console.log('🔍 Environment Variables Status:');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('MONGO_URI value:', process.env.MONGO_URI ? 'Set' : 'NOT SET');
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);



const app = express();
const PORT = process.env.PORT || 5000;

// Stelle Verbindung zur Datenbank her
connectDB();

// Mongoose Debug-Modus aktivieren
// mongoose.set('debug', true);

// Middleware
app.use(cors({
  origin: frontendUrl,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Request-Logging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  console.log('📋 Body:', req.body);
  next();
});

// Debug: Log alle eingehenden Requests
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path}`, req.body);
    next();
});

// Authentifizierungs-/Login-/Passwort-Routen
app.use('/api/auth', authRoutes);
app.use('/api/auth', verifyRoutes);
app.use('/api/auth', passwordResetRequestRoute);
app.use('/api/auth', passwordResetRoute);


// User-Routen
app.use('/api', publicUserRoutes);
app.use('/api', profileRoutes);
app.use('/api', userRoutes);

// Content-Routen
app.use('/api/blogs', blogRoutes);
app.use('/api', blogCommentRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/event-comments', eventCommentRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/help', helpQuestionRoutes);
app.use('/api/help/answer', helpAnswerRoutes);

app.get('/', (req, res) => {
  res.send('Willkommen im "Hand in Hand"-Backend!');
});

// Starte den Server
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});

