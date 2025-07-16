import express from 'express';
import User from '../models/UserModel.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';

console.log("passwordResetRequestRoute.js wurde geladen");

const router = express.Router();

// Route für Password-Reset-Anfrage (6-stelliger Code)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'E-Mail-Adresse ist erforderlich' 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ 
        success: true, 
        message: 'Falls ein Account mit dieser E-Mail existiert, wurde eine Reset-E-Mail gesendet.' 
      });
    }

    // 6-stelligen Reset-Code generieren
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 60 * 60 * 1000; // 1 Stunde gültig
    await user.save();

    // E-Mail mit Reset-Code senden
    await sendPasswordResetEmail(user.email, resetCode);
    console.log(`Reset-Code für ${user.email}: ${resetCode}`);

    res.status(200).json({ 
      success: true, 
      message: 'Falls ein Account mit dieser E-Mail existiert, wurde eine Reset-E-Mail gesendet.' 
    });
  } catch (error) {
    console.error('Reset password request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Serverfehler beim Anfordern des Reset-Codes' 
    });
  }
});

export default router;



