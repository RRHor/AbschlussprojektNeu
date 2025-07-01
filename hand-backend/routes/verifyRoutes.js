// verifyRoutes.js
// Enthält alle Routen zur E-Mail-Verifizierung von Usern zum Backend

import express from 'express';
import User from '../models/userSchema.js';

const router = express.Router();

/**
 * POST /verify
 * Verifiziert einen User anhand des Codes
 */
router.post('/verify', async (req, res) => {
  const { email, code } = req.body;
  
  try {
    const user = await User.findOne({ 
      email, 
      verificationCode: code.toString() 
    });

    if (!user) {
      return res.status(400).json({ message: 'Ungültiger Code oder E-Mail' });
    }

    // Prüfe Code-Ablauf (falls implementiert)
    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ message: 'Code ist abgelaufen' });
    }

    if (user.isVerify) {
      return res.status(400).json({ message: 'E-Mail bereits verifiziert' });
    }

    // Verifizierung durchführen
    user.isVerify = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    res.json({ message: 'E-Mail erfolgreich verifiziert!' });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
});

/**
 * GET /verify-link
 * Wird vom Link in der E-Mail aufgerufen
 */
router.get('/verify-link', async (req, res) => {
  const { code, userId } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  try {
    const user = await User.findOne({ 
      _id: userId, 
      verificationCode: code 
    });

    if (!user) {
      return res.redirect(`${frontendUrl}/verify?status=error&message=invalid_code`);
    }

    // Prüfe Code-Ablauf
    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
      return res.redirect(`${frontendUrl}/verify?status=error&message=expired`);
    }

    if (!user.isVerify) {
      user.isVerify = true;
      user.verificationCode = null;
      user.verificationCodeExpires = null;
      await user.save();
    }

    return res.redirect(`${frontendUrl}/login?verified=true`);
  } catch (error) {
    console.error('Verify link error:', error);
    return res.redirect(`${frontendUrl}/verify?status=error&message=server_error`);
  }
});

export default router;