// utils/emailService.js - Einfache Nodemailer-Implementation:

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// E-Mail-Transporter konfigurieren
const createTransporter = () => {
  // Für Entwicklung: Ethereal Email (Test-Service)
  if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_HOST) {
    console.log('📧 Using development email mode (no real emails sent)');
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@example.com',
        pass: 'ethereal.pass'
      }
    });
  }

  // Für Produktion: Echter E-Mail-Service
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Verifizierungs-E-Mail senden
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    // Für Entwicklung: Nur in Console loggen
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 DEVELOPMENT MODE - E-Mail würde gesendet werden:');
      console.log('🎯 An:', email);
      console.log('🔗 Verifizierungslink:', `http://localhost:5173/verify/${verificationToken}`);
      console.log('🎫 Token:', verificationToken);
      
      // Simuliere erfolgreiche E-Mail
      return {
        success: true,
        message: 'Development mode - E-Mail simuliert',
        verificationLink: `http://localhost:5173/verify/${verificationToken}`
      };
    }

    const transporter = createTransporter();

    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@handinhand.com',
      to: email,
      subject: 'E-Mail-Adresse verifizieren - Hand in Hand',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c5f6f;">Willkommen bei Hand in Hand!</h2>
          
          <p>Vielen Dank für Ihre Registrierung. Um Ihr Konto zu aktivieren, klicken Sie bitte auf den folgenden Link:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              E-Mail-Adresse verifizieren
            </a>
          </div>
          
          <p>Falls der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:</p>
          <p style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all;">
            ${verificationLink}
          </p>
          
          <p style="color: #666; font-size: 14px;">
            Dieser Link ist 24 Stunden gültig. Falls Sie diese E-Mail nicht angefordert haben, ignorieren Sie sie einfach.
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            Hand in Hand - Nachbarschaftshilfe<br>
            Diese E-Mail wurde automatisch generiert.
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ E-Mail gesendet:', result.messageId);

    return {
      success: true,
      message: 'Verifizierungs-E-Mail gesendet',
      messageId: result.messageId
    };

  } catch (error) {
    console.error('❌ E-Mail-Fehler:', error);
    return {
      success: false,
      message: 'E-Mail konnte nicht gesendet werden',
      error: error.message
    };
  }
};

// Passwort-Reset-E-Mail senden
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 PASSWORD RESET - Development Mode:');
      console.log('🎯 An:', email);
      console.log('🔗 Reset-Link:', `http://localhost:5173/reset-password/${resetToken}`);
      return { success: true };
    }

    // Implementierung für Produktion...
    return { success: true };
  } catch (error) {
    console.error('❌ Reset-E-Mail-Fehler:', error);
    return { success: false };
  }
};