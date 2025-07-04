// Dotenv zuerst laden
import dotenv from 'dotenv';
dotenv.config();

// // Debug: Überprüfe ob .env geladen wurde
// console.log('🔧 .env loaded - MONGODB_URI exists:', !!process.env.MONGODB_URI);
// console.log('🔧 PORT:', process.env.PORT);

// Importiere andere Module NACH dotenv.config()
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import connectDB from './database/database.js';
import authRoutes from './routes/authRoutes.js';
import verifyRoutes from './routes/verifyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import blogCommentRoutes from './routes/blogCommentRoutes.js';
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
import helpQuestionRoutes from './routes/helpQuestionRoutes.js';
import helpAnswerRoutes from './routes/helpAnswerRoutes.js';


const app = express();
const PORT = process.env.PORT || 4000;

// Stelle Verbindung zur Datenbank her
connectDB();

// Mongoose Debug-Modus aktivieren
// mongoose.set('debug', true);

// Middleware
app.use(cors());
app.use(express.json());

// Debug: Log alle eingehenden Requests
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path}`, req.body);
    next();
});

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
app.use('/api', profileRoutes);
app.use('/api', adressRoutes);

// Content-Routen
app.use('/api/blogs', blogRoutes);
app.use('/api', blogCommentRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
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

