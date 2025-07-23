import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

const router = express.Router();

// Login-Route
router.post('/login', async (req, res) => {
  const { email, nickname, username, password } = req.body;
  console.log('🔐 Login attempt:', { email, nickname, username, passwordLength: password?.length });
  try {
    // Debug: Alle User ausgeben
    const allUsers = await User.find({});
    console.log('📋 [DEBUG] Alle User in MongoDB:', allUsers.map(u => ({ email: u.email, nickname: u.nickname, username: u.username })));
    // Flexible ODER-Logik wie in authRoutes.js
    const searchFields = [
      email ? { email } : null,
      nickname ? { nickname } : null,
      username ? { username } : null
    ].filter(Boolean);
    console.log('🔎 [DEBUG] ODER-Suche im Login:', searchFields);
    const user = await User.findOne({ $or: searchFields });
    if (!user) {
      console.log('❌ User not found:', { email, nickname, username });
      return res.status(401).json({ message: 'Ungültige E-Mail/Nickname/Username oder Passwort' });
    }
    // Debug: Gefundenen User komplett ausgeben
    console.log('🧑 [DEBUG] Gefundener User:', JSON.stringify(user, null, 2));
    // Debug: Passwort-Hash ausgeben
    console.log('🔑 [DEBUG] Gespeicherter Passwort-Hash:', user.password);
    console.log('👤 User found:', {
      nickname: user.nickname,
      username: user.username,
      hasPassword: !!user.password,
      passwordLength: user.password?.length,
      isActive: user.isActive,
      isVerify: user.isVerified || user.isVerify
    });
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔍 Password comparison result:', isMatch);
    if (!isMatch) {
      console.log('❌ Password mismatch for user:', user.nickname);
      return res.status(401).json({ message: 'Ungültige E-Mail/Nickname/Username oder Passwort' });
    }
    console.log('✅ Login successful for:', user.nickname);
    const token = jwt.sign(
      { id: user._id, nickname: user.nickname },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({
      token,
      user: {
        _id: user._id,
        nickname: user.nickname,
        username: user.username,
        email: user.email,
        addresses: user.addresses,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        isVerify: user.isVerified || user.isVerify
      }
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

export default router;