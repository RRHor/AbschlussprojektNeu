
import express from 'express';
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


// import express from 'express';
// import User from '../models/userSchema.js';
// import crypto from 'crypto';
// import { sendPasswordResetEmail } from '../utils/emailService.js';

// console.log("passwordResetRequestRoute.js wurde geladen");

// const router = express.Router();

// router.post('/forgot-password', async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) {
//     return res.status(404).json({ message: 'E-Mail nicht gefunden.' });
//   }

//   // Token generieren
//   const token = crypto.randomBytes(32).toString('hex');
//   user.resetToken = token;
//   user.resetTokenExpires = Date.now() + 1000 * 60 * 60; // 1 Stunde gültig
  
//   // 6-stelligen Verifizierungscode generieren
//   const verificationCode = Math.floor(100000 + Math.random() * 900000);
//   user.verificationCode = verificationCode;

//   await user.save();

//   // --- HIER: Nur noch die zentrale Mailfunktion für Passwort-Reset verwenden ---
//   await sendPasswordResetEmail(user.email, token);


//   // Link für die E-Mail
//   const resetLink = `http://localhost:5173/reset-password?token=${token}`;
//   // await sendMail(user.email, `Dein Link: ${resetLink}`);
//   // console.log(`Reset-Link für ${user.email}: ${resetLink}`);


//   // E-Mail-Text mit Code und/oder Link
//   const mailText = `
//     Dein Bestätigungscode: ${verificationCode}
//     Oder nutze diesen Link zum Zurücksetzen: ${resetLink}
//   `;

//   await sendVerificationEmail(user.email, verificationCode);
//   console.log(`Reset-Link für ${user.email}: ${resetLink}`);
//   console.log(`Verifizierungscode für ${user.email}: ${verificationCode}`);


//   res.json({ message: 'E-Mail zum Zurücksetzen wurde gesendet.' });
// });

// export default router;