
import express from 'express';
import User from '../models/userSchema.js';

const router = express.Router();

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() }
  });
  if (!user) {
    return res.status(400).json({ message: 'Token ungültig oder abgelaufen.' });
  }

  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  res.json({ message: 'Passwort erfolgreich geändert.' });
});

export default router;