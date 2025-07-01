
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

  // Token für Passwort-Reset generieren
  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 1000 * 60 * 60; // 1 Stunde gültig


// Verifizierungscode generieren und speichern
const verificationCode = Math.floor(100000 + Math.random() * 900000);
user.verificationCode = verificationCode;

  await user.save();

  // Nur die zentrale Mailfunktion für Passwort-Reset verwenden!
  await sendPasswordResetEmail(user.email, token, verificationCode);

  // Logging (optional)
  console.log(`Reset-Link für ${user.email}: http://localhost:5173/reset-password?token=${token}`);

  res.json({ message: 'E-Mail zum Zurücksetzen wurde gesendet.' });
});

export default router;