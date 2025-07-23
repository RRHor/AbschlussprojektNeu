

import express from 'express';
import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Route für Password-Reset (mit Token in der URL)
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { email, newPassword } = req.body;

    // User anhand des Tokens und E-Mail finden
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Ungültiger oder abgelaufener Token' });
    }

    // Neues Passwort hashen und speichern
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.resetCode = null;
    user.resetCodeExpires = null;
    user.markModified('password');
    await user.save();

    res.json({ message: 'Passwort erfolgreich zurückgesetzt (Token-Route)' });
  } catch (error) {
    console.error('❌ Password reset error (Token-Route):', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Zurücksetzen des Passworts (Token-Route)'
    });
  }
});

// Route für Password-Reset (ohne Token in der URL, sondern mit Daten im Body)
router.post('/reset-password', async (req, res) => {
  try {
    // "resetCode" und "code" sind beide erlaubt, damit verschiedene Frontends funktionieren
    const { email, resetCode, code, resetPasswordToken, newPassword } = req.body;
    const realResetCode = resetCode || code;
    let user = null;

    // 1. Suche User mit gültigem Reset-Code (6-stelliger Code aus E-Mail, Nickname oder Username)
    if (realResetCode) {
      user = await User.findOne({
        $or: [
          { email },
          { nickname: email },
          { username: email }
        ],
        resetCode: realResetCode,
        resetCodeExpires: { $gt: Date.now() }
      });
    }

    // 2. Alternativ: Suche User mit gültigem Reset-Token (z.B. für Links)
    if (!user && resetPasswordToken) {
      user = await User.findOne({
        $or: [
          { email },
          { nickname: email },
          { username: email }
        ],
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
      });
    }

    if (!user) {
      return res.status(400).json({ message: 'Ungültiger oder abgelaufener Code/Token' });
    }

    // Neues Passwort hashen und speichern
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetCode = null;
    user.resetCodeExpires = null;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.markModified('password');
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

// import express from 'express';
// import User from '../models/UserModel.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// const router = express.Router();

// // Route für Password-Reset (mit Token)
// // router.post('/reset-password/:token', async (req, res) => {
// //   try {
// //     const { token } = req.params;
// //     const { newPassword, confirmPassword } = req.body;
    
// //     console.log('🔄 Password reset attempt:', { email, resetCode: resetCode?.substring(0, 6) + '...', newPasswordLength: newPassword?.length });
    
// //     // User finden und Code überprüfen
// //     const user = await User.findOne({ 
// //       email, 
// //       resetCode,
// //       resetCodeExpires: { $gt: Date.now() } // Code noch gültig
// //     });
    
// //     if (!user) {
// //       console.log('❌ User not found or code invalid:', { email, resetCode });
// //       return res.status(400).json({ message: 'Ungültiger oder abgelaufener Code' });
// //     }

// //     console.log('✅ User found, resetting password for:', user.nickname);
// //     console.log('🔍 Current password hash length:', user.password?.length);
// //     console.log('🔍 New password length:', newPassword?.length);

// //     // Neues Passwort hashen und speichern
// //     const hashedPassword = await bcrypt.hash(newPassword, 10);
// //     console.log('🔐 New hashed password length:', hashedPassword?.length);
    
// //     // Das Middleware erkennt jetzt, dass das Passwort bereits gehasht ist
// //     user.password = hashedPassword;
// //     user.resetCode = null;
// //     user.resetCodeExpires = null;
    
// //     const savedUser = await user.save();
// //     console.log('💾 User saved, final password hash length:', savedUser.password?.length);

// //     console.log('✅ Password successfully updated in database for:', user.nickname);

// //     res.json({ 
// //       message: 'Passwort erfolgreich zurückgesetzt'
// //     });

// //   } catch (error) {
// //     console.error('❌ Password reset error:', error);
// //     res.status(500).json({ 
// //       success: false, 
// //       message: 'Serverfehler beim Zurücksetzen des Passworts' 
// //     });
// //   }
// // });

// // Route für Password-Reset (ohne Token in der URL, sondern mit Daten im Body)
// router.post('/reset-password', async (req, res) => {
//   try {
//     // const { email, resetCode, newPassword } = req.body;
//      const { email, resetCode, resetPasswordToken, newPassword } = req.body;

    

//     // // User finden und Code überprüfen
//      let user = null;
//     // const user = await User.findOne({
//     //   email,
//     //   resetCode,
//     //   resetCodeExpires: { $gt: Date.now() }
//     // });

//   if (resetCode) {
//   user = await User.findOne({
//     email,
//     resetCode,
//     resetCodeExpires: { $gt: Date.now() }
//     });
//   }


//     // Prüfe alternativ auf Token
//     if (!user && resetPasswordToken) {
//       user = await User.findOne({
//         email,
//         resetPasswordToken,
//         resetPasswordExpires: { $gt: Date.now() }
//   });
// }

//     if (!user) {
//       return res.status(400).json({ message: 'Ungültiger oder abgelaufener Code' });
//     }

//     // Neues Passwort hashen und speichern
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     user.resetCode = null;
//     user.resetCodeExpires = null;
//     user.resetPasswordToken = null;
//     user.resetPasswordExpires = null;

//     // Trick: Middleware überspringen, weil Passwort schon gehasht ist
//     user.markModified('password');

//     await user.save();

//     res.json({ message: 'Passwort erfolgreich zurückgesetzt' });
//   } catch (error) {
//     console.error('❌ Password reset error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Serverfehler beim Zurücksetzen des Passworts'
//     });
//   }
// });

// export default router;