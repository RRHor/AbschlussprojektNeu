// server.js - Korrigierte Version
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';

// Dotenv zuerst laden
dotenv.config();

// Alle Standard-Imports
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

// Alle Route-Imports 
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

// Registriere das User-Modell mit deinem Schema
if (!mongoose.models.User) {
  mongoose.model("User", userSchema);
}

// ES6 Module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug Environment Variables
console.log('🔍 Environment Variables Status:');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 DIREKTE MONGODB-VERBINDUNG
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB erfolgreich verbunden');
    console.log('📊 Datenbank:', mongoose.connection.name);
    console.log('🔗 Verbindungsstatus:', mongoose.connection.readyState);
  })
  .catch((error) => {
    console.error('❌ MongoDB Verbindungsfehler:', error);
    process.exit(1);
  });

// MongoDB-Verbindungsereignisse
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected from MongoDB');
});

// Middleware
app.use(cors({
  origin: frontendUrl,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// 🔧 SICHERES Request-Logging (KORRIGIERT)
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  
  // Sichere Überprüfung des req.body
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    console.log('📋 Body:', JSON.stringify(req.body, null, 2));
  }
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
app.use('/api/users', userRoutes);

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

// Route-Debug
app.get('/api/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const basePath = middleware.regexp.source.replace('\\/?(?=\\/|$)', '').replace(/\\\//g, '/').replace(/\^|\$/g, '');
          routes.push({
            path: basePath + handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json({ routes: routes.sort((a, b) => a.path.localeCompare(b.path)) });
});

app.get('/', (req, res) => {
  res.send('Willkommen im "Hand in Hand"-Backend!');
});

// Error-Handling Middleware
app.use((error, req, res, next) => {
  console.error('🔴 Server Error:', error);
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: error.message 
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutdown Signal empfangen...');
  await mongoose.connection.close();
  console.log('✅ MongoDB-Verbindung geschlossen');
  process.exit(0);
});

// Starte den Server
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
  console.log(`🌐 Frontend URL: ${frontendUrl}`);
  console.log(`🔍 Alle Routen anzeigen: http://localhost:${PORT}/api/routes`);
});

