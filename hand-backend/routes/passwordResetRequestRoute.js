import express from 'express';
import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '../utils/emailService.js';

console.log("passwordResetRequestRoute.js wurde geladen");

const router = express.Router();

// Route für Password-Reset-Anfrage
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('🔐 Password reset request for:', email);
    
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

    // Reset-Token generieren
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );

    // Token in DB speichern
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 6 * 60 * 60 * 1000;
    await user.save();

    console.log('🎫 Reset token generated for:', email);

    // E-Mail senden
    const emailResult = await sendPasswordResetEmail(email, resetToken);
    
    if (emailResult.success) {
      console.log('✅ Password reset email sent successfully');
    } else {
      console.error('❌ Failed to send email:', emailResult.message);
    }

    res.status(200).json({ 
      success: true, 
      message: 'Falls ein Account mit dieser E-Mail existiert, wurde eine Reset-E-Mail gesendet.' 
    });

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Serverfehler beim Senden der Reset-E-Mail' 
    });
  }
});

export default router;



