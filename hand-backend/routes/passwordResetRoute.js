import express from 'express';
import User from '../models/userSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/password-reset', async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    
    // User finden und Code überprüfen
    const user = await User.findOne({ 
      email, 
      resetCode,
      resetCodeExpires: { $gt: Date.now() } // Code noch gültig
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Ungültiger oder abgelaufener Code' });
    }

    // Neues Passwort hashen und speichern
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null;
    user.resetCodeExpires = null;
    await user.save();

    // Neues JWT-Token generieren
    const token = jwt.sign(
      { _id: user._id, nickname: user.nickname },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ 
      message: 'Passwort erfolgreich zurückgesetzt',
      token,
      user: {
        _id: user._id,
        nickname: user.nickname,
        email: user.email,
        addresses: user.addresses,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        isVerify: user.isVerify
      }
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

export default router;