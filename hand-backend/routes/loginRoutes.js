import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';

const router = express.Router();

// Login-Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Login attempt:', { email, passwordLength: password?.length });
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Ungültige E-Mail oder Passwort' });
    }
    
    console.log('👤 User found:', { 
      nickname: user.nickname, 
      hasPassword: !!user.password, 
      passwordLength: user.password?.length,
      isActive: user.isActive,
      isVerify: user.isVerify
    });
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔍 Password comparison result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for user:', user.nickname);
      return res.status(401).json({ message: 'Ungültige E-Mail oder Passwort' });
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
        email: user.email,
        addresses: user.addresses,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        isVerify: user.isVerify
      }
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

export default router;