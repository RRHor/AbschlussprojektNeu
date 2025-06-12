import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
// Lade Umgebungsvariablen
dotenv.config();
// E-Mail-Transporter konfigurieren
const transporter = nodemailer.createTransport({
  service: 'gmail',
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
 * @returns {Promise<Object>} - Erfolgs- oder Fehlerstatus
 */
export const sendVerificationEmail = async (to, verificationCode) => {
  try {
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
          <p><a href="http://localhost:5173/verify?code=${verificationCode}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">E-Mail bestätigen</a></p>
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
 * Funktion zum Versenden einer Passwort-Reset-E-Mail
 * @param {string} to - E-Mail-Adresse des Empfängers
 * @param {string} resetToken - Der Reset-Token
 * @returns {Promise<Object>} - Erfolgs- oder Fehlerstatus
 */
export const sendPasswordResetEmail = async (to, resetToken) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Passwort zurücksetzen für Hand-Hand',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E1E1E1; border-radius: 5px;">
          <h2 style="color: #333;">Passwort zurücksetzen</h2>
          <p>Du erhältst diese E-Mail, weil du (oder jemand anderes) ein Zurücksetzen deines Passworts angefordert hat.</p>
          <p>Klicke auf den folgenden Link, um dein Passwort zurückzusetzen:</p>
          <p><a href="http://localhost:5173/reset-password?token=${resetToken}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Passwort zurücksetzen</a></p>
          <p>Dieser Link ist 1 Stunde gültig.</p>
          <p>Wenn du das nicht angefordert hast, ignoriere diese E-Mail bitte.</p>
          <p>Viele Grüße,<br>Dein Hand-Hand Team</p>
        </div>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Passwort-Reset-E-Mail gesendet:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Fehler beim Senden der Passwort-Reset-E-Mail:', error);
    return { success: false, error: error.message };
  }
};
/**
 * Funktion zum Versenden einer Willkommens-E-Mail
 * @param {string} to - E-Mail-Adresse des Empfängers
 * @param {string} username - Benutzername
 * @returns {Promise<Object>} - Erfolgs- oder Fehlerstatus
 */
export const sendWelcomeEmail = async (to, username) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Willkommen bei Hand-Hand!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E1E1E1; border-radius: 5px;">
          <h2 style="color: #333;">Hallo ${username}!</h2>
          <p>Willkommen bei Hand-Hand, deiner Nachbarschafts-App.</p>
          <p>Wir freuen uns, dass du Teil unserer Community bist.</p>
          <p>Mit Hand-Hand kannst du:</p>
          <ul>
            <li>Neue Freunde in deiner Nachbarschaft finden</li>
            <li>Hilfe anbieten oder erhalten</li>
            <li>An lokalen Veranstaltungen teilnehmen</li>
            <li>Gemeinschaftsprojekte starten</li>
          </ul>
          <p>Viel Spaß beim Erkunden!</p>
          <p>Viele Grüße,<br>Dein Hand-Hand Team</p>
        </div>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Willkommens-E-Mail gesendet:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Fehler beim Senden der Willkommens-E-Mail:', error);
    return { success: false, error: error.message };
  }
};
export default {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};