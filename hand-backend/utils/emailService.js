// utils/emailService.js - Einfache Nodemailer-Implementation:

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// E-Mail-Transporter konfigurieren
const createTransporter = () => {
  // Für Entwicklung: Ethereal Email (Test-Service)
  if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_HOST) {
    console.log('📧 Using development email mode (no real emails sent)');
    return nodemailer.createTransport({  // ← KORRIGIERT: createTransport (nicht createTransporter)
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@example.com',
        pass: 'ethereal.pass'
      }
    });
  }

  // Für Produktion: Echter E-Mail-Service
  return nodemailer.createTransport({  // ← KORRIGIERT: createTransport (nicht createTransporter)
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    debug: process.env.NODE_ENV !== 'production'
  });
};

/**
 * Verifizierungs-E-Mail senden (Token-basiert für moderne Auth)
 */
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

/**
 * Passwort-Reset-E-Mail senden
 */
export const sendPasswordResetEmail = async (email, resetToken, verificationCode = null) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 PASSWORD RESET - Development Mode:');
      console.log('🎯 An:', email);
      console.log('🔗 Reset-Link:', `http://localhost:5173/reset-password/${resetToken}`);
      if (verificationCode) {
        console.log('🔢 Verification Code:', verificationCode);
      }
      return { success: true, message: 'Development mode - Reset-E-Mail simuliert' };
    }

    const transporter = createTransporter();

    let codeHtml = '';
    if (verificationCode) {
      codeHtml = `
        <p>Dein Bestätigungscode zum Zurücksetzen des Passworts:</p>
        <div style="background-color: #F5F5F5; padding: 10px; border-radius: 4px; font-size: 20px; letter-spacing: 2px; text-align: center; margin: 20px 0;">
          <strong>${verificationCode}</strong>
        </div>
        <p>Du kannst alternativ auch den Link unten nutzen.</p>
      `;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@handinhand.com',
      to: email,
      subject: 'Passwort zurücksetzen - Hand in Hand',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E1E1E1; border-radius: 5px;">
          <h2 style="color: #333;">Passwort zurücksetzen</h2>
          <p>Du erhältst diese E-Mail, weil du (oder jemand anderes) ein Zurücksetzen deines Passworts angefordert hat.</p>
          ${codeHtml}
          <p>Klicke auf den folgenden Link, um dein Passwort zurückzusetzen:</p>
          <p><a href="http://localhost:5173/reset-password?token=${resetToken}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Passwort zurücksetzen</a></p>
          <p>Dieser Link ist 1 Stunde gültig.</p>
          <p>Wenn du das nicht angefordert hast, ignoriere diese E-Mail bitte.</p>
          <p>Viele Grüße,<br>Dein Hand-Hand Team</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Reset-E-Mail gesendet:', result.messageId);

    return {
      success: true,
      message: 'Reset-E-Mail gesendet',
      messageId: result.messageId
    };

  } catch (error) {
    console.error('❌ Reset-E-Mail-Fehler:', error);
    return {
      success: false,
      message: 'Reset-E-Mail konnte nicht gesendet werden',
      error: error.message
    };
  }
};

/**
 * Willkommens-E-Mail senden
 */
export const sendWelcomeEmail = async (to, username) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 WELCOME EMAIL - Development Mode:');
      console.log('🎯 An:', to);
      console.log('👤 Username:', username);
      return { success: true, message: 'Development mode - Welcome-E-Mail simuliert' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@handinhand.com',
      to: to,
      subject: 'Willkommen bei Hand in Hand!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E1E1E1; border-radius: 5px;">
          <h2 style="color: #2c5f6f;">Willkommen bei Hand in Hand, ${username}!</h2>
          <p>Schön, dass du Teil unserer Nachbarschafts-Community bist!</p>
          <p>Du kannst jetzt:</p>
          <ul>
            <li>📝 Hilfsanfragen erstellen</li>
            <li>🤝 Anderen Nachbarn helfen</li>
            <li>💬 Dich mit deiner Community vernetzen</li>
            <li>📰 Lokale Events und News entdecken</li>
          </ul>
          <p style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/dashboard" style="background-color: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Jetzt loslegen
            </a>
          </p>
          <p>Viele Grüße,<br>Dein Hand-Hand Team</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome-E-Mail gesendet:', result.messageId);

    return {
      success: true,
      message: 'Welcome-E-Mail gesendet',
      messageId: result.messageId
    };

  } catch (error) {
    console.error('❌ Welcome-E-Mail-Fehler:', error);
    return {
      success: false,
      message: 'Welcome-E-Mail konnte nicht gesendet werden',
      error: error.message
    };
  }
};