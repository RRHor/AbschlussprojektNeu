
import express from 'express'
import User from '../models/userSchema.js';
import { sendVerificationEmail } from '../utils/emailService.js';


console.log("passwordResetRequestRoute.js wurde geladen");

const router = express.Router();

// Route für Verifizierungs-Code nach Registrierung
router.post('/send-verification', async (req, res) => {
  const { email, userId } = req.body;
  const user = await User.findOne({ email, _id: userId });
  if (!user) {
    return res.status(404).json({ message: 'User nicht gefunden.' });
  }

  // Neuen 6-stelligen Verifizierungscode generieren
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  user.verificationCode = verificationCode;
  user.isVerify = false;
  await user.save();

  // Verifizierungs-E-Mail senden
  await sendVerificationEmail(user.email, verificationCode, user._id);

  console.log(`Verifizierungscode für ${user.email}: ${verificationCode}`);

  res.json({ message: 'Verifizierungscode gesendet.' });
});

export default router;



