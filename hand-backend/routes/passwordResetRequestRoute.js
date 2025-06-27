
import express from 'express';
import User from '../models/UserModel.js';
import crypto from 'crypto';
// import sendMail from '../utils/sendMail.js'; // Optional: Mailversand

console.log("passwordResetRequestRoute.js wurde geladen");

const router = express.Router();

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'E-Mail nicht gefunden.' });
  }

  // Token generieren
  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 1000 * 60 * 60; // 1 Stunde gültig
  await user.save();

  // Link für die E-Mail
  const resetLink = `http://localhost:5173/reset-password?token=${token}`;
  // await sendMail(user.email, `Dein Link: ${resetLink}`);
  console.log(`Reset-Link für ${user.email}: ${resetLink}`);

  res.json({ message: 'E-Mail zum Zurücksetzen wurde gesendet.' });
});

export default router;