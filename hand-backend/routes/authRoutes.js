import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import sendVerificationEmail from '../utils/sendVerificationEmail.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, adress } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User bereits vorhanden' });
        }

        const newUser = new User({
            name,
            email,
            password,
            adress
        });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            message: 'User erfolgreich erstellt',
            token,
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            adress: newUser.adress,
            isAdmin: newUser.isAdmin,
            isActive: newUser.isActive,
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Serverfehler' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user ){ 
            return res.status(404).json({ message: 'User nicht gefunden' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({
            message: 'Login erfolgreich',
            token,
            _id: user._id,
            name: user.name,
            email: user.email,
            adress: user.adress,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Serverfehler' });
    }
});

router.post('/logout', (req, res) => {
    res.json({ message: 'Logout erfolgreich' });
});

// Route zum Verifizieren des Codes
router.post('/verify', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Verifizierungscode erforderlich' });
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    res.status(200).json({
      message: 'E-Mail erfolgreich verifiziert',
      verified: true
    });
  } catch (error) {
    console.error('Fehler bei der Verifizierung:', error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Beispiel-Route für E-Mail-Verifizierung
router.post('/request-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'E-Mail-Adresse erforderlich' });
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Hier würdest du normalerweise den Code in der Datenbank speichern
    // und mit dem Benutzer verknüpfen
    // Sende die E-Mail mit dem ausgelagerten Service
    const emailResult = await sendVerificationEmail(email, verificationCode);
    if (emailResult.success) {
      res.status(200).json({
        message: 'Verifizierungscode wurde gesendet',
        email
      });
    } else {
      res.status(500).json({ message: 'Fehler beim Senden des Verifizierungscodes' });
    }
  } catch (error) {
    console.error('Fehler bei der Anfrage:', error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Route zum Abrufen der Benutzerdaten
router.get('/users/me', authMiddleware, async (req, res) => {
  res.json(req.user);
});

export default router;