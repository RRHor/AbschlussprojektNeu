import express from 'express';
import User from '../models/UserModel.js';  // ← KORRIGIERT
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Route für Password-Reset (mit Token)
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;
    
    console.log('🔄 Password reset attempt:', { email, resetCode: resetCode?.substring(0, 6) + '...', newPasswordLength: newPassword?.length });
    
    // User finden und Code überprüfen
    const user = await User.findOne({ 
      email, 
      resetCode,
      resetCodeExpires: { $gt: Date.now() } // Code noch gültig
    });
    
    if (!user) {
      console.log('❌ User not found or code invalid:', { email, resetCode });
      return res.status(400).json({ message: 'Ungültiger oder abgelaufener Code' });
    }

    console.log('✅ User found, resetting password for:', user.nickname);
    console.log('🔍 Current password hash length:', user.password?.length);
    console.log('🔍 New password length:', newPassword?.length);

    // Neues Passwort hashen und speichern
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('🔐 New hashed password length:', hashedPassword?.length);
    
    // Das Middleware erkennt jetzt, dass das Passwort bereits gehasht ist
    user.password = hashedPassword;
    user.resetCode = null;
    user.resetCodeExpires = null;
    
    const savedUser = await user.save();
    console.log('💾 User saved, final password hash length:', savedUser.password?.length);

    console.log('✅ Password successfully updated in database for:', user.nickname);

    res.json({ 
      message: 'Passwort erfolgreich zurückgesetzt'
    });

  } catch (error) {
    console.error('❌ Password reset error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Serverfehler beim Zurücksetzen des Passworts' 
    });
  }
});

// Route für Password-Reset (ohne Token in der URL, sondern mit Daten im Body)
router.post('/password-reset', async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    // User finden und Code überprüfen
    const user = await User.findOne({
      email,
      resetCode,
      resetCodeExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Ungültiger oder abgelaufener Code' });
    }

    // Neues Passwort hashen und speichern
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetCode = null;
    user.resetCodeExpires = null;

    await user.save();

    res.json({ message: 'Passwort erfolgreich zurückgesetzt' });
  } catch (error) {
    console.error('❌ Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Zurücksetzen des Passworts'
    });
  }
});

export default router;