import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import connectDB from './database/database.js'



// const app = express();
// const PORT = process.env.PORT;

// const mongoUrl = process.env.MONGODB_URL
// console.log('MongoDB URL:', mongoUrl) // Zum Debuggen

// mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection failed:', err))

// connectDB();

// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Willkommen im Hand in Hand Backend!');
// });

// app.listen(PORT, () => {
//   console.log(`Server läuft auf http://localhost:${PORT}`);
// }
// );



const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Willkommen im Hand in Hand Backenend!');
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
