// verifyRoutes.js
// Enthält alle Routen zur E-Mail-Verifizierung von Usern zum Backend

import express from 'express';
import User from '../models/userSchema.js';

const router = express.Router();

/**
 * POST /api/auth/verify
 * Verifiziert einen User anhand des Codes (z.B. aus dem Frontend-Formular)
 */
router.post('/auth/verify', async (req, res) => {
  const { code, userId } = req.body;
  try {
    // Suche User anhand userId und Code (optional: nur Code, wie bisher)
    const user = userId
      ? await User.findOne({ _id: userId, verificationCode: Number(code) })
      : await User.findOne({ verificationCode: Number(code) });

    if (!user) {
      return res.status(400).json({ message: 'Ungültiger oder abgelaufener Code' });
    }
    if (user.isVerify) {
      return res.status(400).json({ message: 'E-Mail bereits verifiziert' });
    }
    user.isVerify = true;
    await user.save();
    res.json({ message: 'E-Mail erfolgreich verifiziert!' });
  } catch (error) {
    res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
});

/**
 * GET /api/auth/verify-link
 * Wird vom Link in der E-Mail aufgerufen.
 * Verifiziert den User und leitet auf das Frontend weiter (z.B. Login-Seite).
 */
router.get('/auth/verify-link', async (req, res) => {
  console.log('GET /auth/verify-link ', req.query); 
  
  const { code, userId } = req.query;
  try {
    const user = await User.findOne({ _id: userId, verificationCode: Number(code) });
    if (!user) {
      // Optional: Fehlerseite im Frontend anzeigen
      return res.redirect('http://localhost:5173/verify?status=error');
    }
    if (!user.isVerify) {
      user.isVerify = true;
      await user.save();
    }
    // Nach erfolgreicher Verifizierung auf die Login-Seite des Frontends weiterleiten
    return res.redirect('http://localhost:5173/login');
  } catch (error) {
    // Optional: Fehlerseite im Frontend anzeigen
    return res.redirect('http://localhost:5173/verify?status=server-error');
  }
});

export default router;