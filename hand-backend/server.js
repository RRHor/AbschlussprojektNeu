import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from './database/database.js';
import authRoutes from './routes/authRoutes.js';
import verifyRoutes from './routes/verifyRoutes.js'; // <--- hinzufügen
import userRoutes from './routes/userRoutes.js';     // <--- hinzufügen
import blogRoutes from './routes/blogRoutes.js';     // <--- hinzufügen
import adRoutes from './routes/adRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', verifyRoutes);      // /api/auth/verify
app.use('/api', userRoutes);        // z.B. /api/users/me
app.use('/api/blog', blogRoutes);   // z.B. /api/blog
app.use('/api/ads', adRoutes);

app.get('/', (req, res) => {
  res.send('Willkommen im "Hand in Hand"-Backend!');
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

