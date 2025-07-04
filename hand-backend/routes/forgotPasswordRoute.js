
import express from 'express';
import User from '../models/userSchema.js';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../utils/emailService.js';

const router = express.Router();

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'E-Mail nicht gefunden.' });
  }

  // Verifizierungscode generieren (6-stellig, benutzerfreundlich)
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  
  // WICHTIG: Den 6-stelligen Code als resetCode verwenden, damit Frontend und Backend synchron sind
  user.resetCode = verificationCode.toString();
  user.resetCodeExpires = Date.now() + 1000 * 60 * 60; // 1 Stunde gültig
  user.verificationCode = verificationCode;

  await user.save();

  // Nur die zentrale Mailfunktion für Passwort-Reset verwenden!
  await sendPasswordResetEmail(user.email, verificationCode.toString(), verificationCode);

  // Logging (optional)
  console.log(`Reset-Link für ${user.email}: http://localhost:5175/forgot-password?code=${verificationCode}`);

  res.json({ message: 'E-Mail zum Zurücksetzen wurde gesendet.' });
});

export default router;