// utils/emailService.js - Einfache Nodemailer-Implementation:

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// E-Mail-Transporter konfigurieren
const transporter = nodemailer.createTransport({
  // service: 'gmail',
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: process.env.NODE_ENV !== 'production', // Debug nur in Entwicklungsumgebung
});
/**
 * Funktion zum Versenden einer Verifizierungs-E-Mail
 * @param {string} to - E-Mail-Adresse des Empfängers
 * @param {string} verificationCode - Der Verifizierungscode
 * @param {string} userId - Die User-ID (für Link)
 * @returns {Promise<Object>} - Erfolgs- oder Fehlerstatus Das gib die Funktion zurück
 */
export const sendVerificationEmail = async (to, verificationCode, userId) => {
  try {

    if (process.env.NODE_ENV === 'development') {
      console.log('📧 DEVELOPMENT MODE - E-Mail würde gesendet werden:');
      console.log('🎯 An:', email);
      console.log('🔗 Verifizierungslink:', `http://localhost:5173/verify/${verificationToken}`);
      return {
        success: true,
        message: 'Development mode - E-Mail simuliert',
        verificationLink: `http://localhost:5173/verify/${verificationToken}`
      };
    }

    const transporter = createTransporter();
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${verificationToken}`;


    console.log('📧 Versuche E-Mail zu senden an:', to);
    console.log('🔢 Verifizierungscode:', verificationCode);
    

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Bestätige deine E-Mail-Adresse für Hand-Hand',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E1E1E1; border-radius: 5px;">


          <h2 style="color: #333;">Willkommen bei Hand-Hand!</h2>
          <p>Danke für deine Registrierung in unserer Nachbarschafts-App.</p>
          <p>Um dein Konto zu aktivieren, gib bitte den folgenden Verifizierungscode ein:</p>
          <div style="background-color: #F5F5F5; padding: 10px; border-radius: 4px; font-size: 20px; letter-spacing: 2px; text-align: center; margin: 20px 0;">
            <strong>${verificationCode}</strong>
          </div>
          <p>Oder klicke auf diesen Link, um deine E-Mail direkt zu bestätigen:</p>
          <p><a href="http://localhost:4000/api/auth/verify-link?userId=${userId}&code=${verificationCode}" style="background-color: #4CAF50; 
          color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          E-Mail bestätigen</a></p>
          <p>Dieser Code ist 24 Stunden gültig.</p>

          <p>Viele Grüße,<br>Dein Hand-Hand Team</p>
        </div>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('E-Mail gesendet:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Passwort-Reset-E-Mail senden
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
  
  console.log('📧 Sending password reset email to:', email);
  
  try {
    console.log('📧 Sending password reset email to:', email);

    
    // RICHTIG (Query-Parameter)
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
    
    // Console-Log für Development

    const forgotPasswordLink = `${process.env.FRONTEND_URL}/forgot-password?code=${resetToken}`;
    const classicLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    console.log('🔗 Password Reset Link für', email + ':');
    // console.log('   ', resetLink);
    console.log('   ', forgotPasswordLink);
    console.log('   ', classicLink);
    

    // Transporter-Auswahl: Service (Gmail etc.) oder klassisch SMTP
    let usedTransporter = transporter;
    if (!process.env.EMAIL_SERVICE) {
      // Fallback: klassischer SMTP-Transporter
      usedTransporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '🔐 Passwort zurücksetzen - Hand in Hand',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Passwort zurücksetzen</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333;">Hallo!</p>
            <p style="font-size: 16px; color: #333;">
              Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts für die <strong>Hand in Hand</strong> Plattform gestellt.
            </p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="font-size: 16px; color: #333; margin-bottom: 8px;">Ihr persönlicher Sicherheits-Code:</p>
              <span style="display: inline-block; font-size: 28px; letter-spacing: 4px; background: #e3e3e3; padding: 12px 32px; border-radius: 8px; font-weight: bold; color: #222; margin-bottom: 8px;">${resetToken}</span>
              <p style="font-size: 13px; color: #888; margin-top: 8px;">Kopieren Sie diesen Code und geben Sie ihn im Browser ein, wenn Sie dem Link nicht trauen.</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${forgotPasswordLink}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 25px; display: inline-block; font-weight: bold;
                        font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                🔑 Passwort zurücksetzen (empfohlen)
              </a>
              <br/><br/>
              <a href="${classicLink}" style="color: #667eea; font-size: 14px;">
                Alternative Link (ältere Versionen): ${classicLink}
              </a>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>⏰ Wichtig:</strong> Dieser Link und Code sind <strong>1 Stunde</strong> gültig.
              </p>
              <p style="margin: 0; color: #b00; font-size: 13px; margin-top: 8px;">
                <strong>Sicherheitstipp:</strong> Geben Sie Ihren Code nur auf der offiziellen Hand-in-Hand-Seite ein und klicken Sie nur auf Links, denen Sie vertrauen.
              </p>
            </div>
            <p style="color: #666; font-size: 14px;">
              Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren. 
              Ihr Passwort bleibt unverändert.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <div style="text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                Hand in Hand - Nachbarschaftshilfe<br>
                Diese E-Mail wurde automatisch generiert.
              </p>
              </div>
          </div>
        </div>
      `
    };

    // const mailOptions = {
    //   from: process.env.EMAIL_FROM,
    //   to: email,
    //   subject: '🔐 Passwort zurücksetzen - Hand in Hand',
    //   html: `
    //     <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
    //       <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    //         <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Passwort zurücksetzen</h1>
    //       </div>
    //       <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    //         <p style="font-size: 16px; color: #333;">Hallo!</p>
    //         <p style="font-size: 16px; color: #333;">
    //           Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts für die <strong>Hand in Hand</strong> Plattform gestellt.
    //         </p>
    //         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
    //           <p style="font-size: 16px; color: #333; margin-bottom: 8px;">Ihr persönlicher Sicherheits-Code:</p>
    //           <span style="display: inline-block; font-size: 28px; letter-spacing: 4px; background: #e3e3e3; padding: 12px 32px; border-radius: 8px; font-weight: bold; color: #222; margin-bottom: 8px;">${resetToken}</span>
    //           <p style="font-size: 13px; color: #888; margin-top: 8px;">Kopieren Sie diesen Code und geben Sie ihn im Browser ein, wenn Sie dem Link nicht trauen.</p>
    //         </div>
    //         <div style="text-align: center; margin: 30px 0;">
    //           <a href="${resetLink}" 
    //              style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
    //                     color: white; padding: 15px 30px; text-decoration: none; 
    //                     border-radius: 25px; display: inline-block; font-weight: bold;
    //                     font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
    //             🔑 Neues Passwort erstellen
    //           </a>
    //         </div>
    //         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
    //           <p style="margin: 0; color: #666; font-size: 14px;">
    //             <strong>⏰ Wichtig:</strong> Dieser Link und Code sind <strong>1 Stunde</strong> gültig.
    //           </p>
    //           <p style="margin: 0; color: #b00; font-size: 13px; margin-top: 8px;">
    //             <strong>Sicherheitstipp:</strong> Geben Sie Ihren Code nur auf der offiziellen Hand-in-Hand-Seite ein und klicken Sie nur auf Links, denen Sie vertrauen.
    //           </p>
    //         </div>
    //         <p style="color: #666; font-size: 14px;">
    //           Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren. 
    //           Ihr Passwort bleibt unverändert.
    //         </p>
    //         <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    //         <div style="text-align: center;">
    //           <p style="color: #999; font-size: 12px; margin: 0;">
    //             Hand in Hand - Nachbarschaftshilfe<br>
    //             Diese E-Mail wurde automatisch generiert.
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   `
    // };

    const info = await usedTransporter.sendMail(mailOptions);
    console.log('E-Mail gesendet:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Fehler beim Senden der Reset-E-Mail:', error);
    return { success: false, error: error.message };
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

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: process.env.NODE_ENV !== 'production',
  });
}