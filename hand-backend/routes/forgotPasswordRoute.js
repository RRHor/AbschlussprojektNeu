import express from 'express';
import User from '../models/UserModel.js';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../utils/emailService.js';

const router = express.Router();

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  // ODER-Logik: Suche nach email, nickname oder username
  const user = await User.findOne({
    $or: [
      { email },
      { nickname: email },
      { username: email }
    ]
  });
  if (!user) {
    return res.status(404).json({ message: 'E-Mail/Nickname/Username nicht gefunden.' });
  }

  // Verifizierungscode generieren (6-stellig, benutzerfreundlich)
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  // WICHTIG: Den 6-stelligen Code als resetCode verwenden, damit Frontend und Backend synchron sind
  user.resetCode = resetCode;
  user.resetCodeExpires = Date.now() + 1000 * 60 * 60; // 1 Stunde gültig
  await user.save();
  // Nur die zentrale Mailfunktion für Passwort-Reset verwenden!
  await sendPasswordResetEmail(user.email, resetCode);
  // Logging (optional)
  console.log(`Reset-Link für ${user.email}: http://localhost:5175/forgot-password?code=${resetCode}`);
  res.json({ message: 'E-Mail zum Zurücksetzen wurde gesendet.' });
});

export default router;