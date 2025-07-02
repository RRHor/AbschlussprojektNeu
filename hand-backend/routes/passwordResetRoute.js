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
    
    console.log('🔐 Password reset attempt with token');
    
    // Validierung
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Neues Passwort und Bestätigung sind erforderlich' 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Passwörter stimmen nicht überein' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Passwort muss mindestens 6 Zeichen lang sein' 
      });
    }

    // Token verifizieren
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ungültiger oder abgelaufener Reset-Token' 
      });
    }

    // User finden mit gültigem Token
    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ungültiger oder abgelaufener Reset-Token' 
      });
    }

    console.log('✅ Valid reset token for user:', user.email);

    // Neues Passwort hashen und speichern
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('✅ Password reset successful for:', user.email);

    res.status(200).json({ 
      success: true, 
      message: 'Passwort erfolgreich zurückgesetzt. Sie können sich jetzt anmelden.' 
    });

  } catch (error) {
    console.error('❌ Password reset error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Serverfehler beim Zurücksetzen des Passworts' 
    });
  }
});

export default router;