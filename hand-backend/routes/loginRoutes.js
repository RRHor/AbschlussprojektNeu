import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';

const router = express.Router();

// Login-Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Ungültige E-Mail oder Passwort' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Ungültige E-Mail oder Passwort' });
    }
    const token = jwt.sign(
      { _id: user._id, nickname: user.nickname },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ 
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
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

export default router;