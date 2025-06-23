import { sendVerificationEmail } from './emailService.js';
import dotenv from 'dotenv';


// Lade Umgebungsvariablen
dotenv.config();
console.log(process.env);


// Test-Funktion für E-Mail-Versand
async function testEmail() {
  const testCode = "123456";
  const testEmail = "ciyew82909@jio1.com"; // Ersetze durch deine neue temporäre E-Mail-Adresse
  console.log(`Sende Test-E-Mail an ${testEmail} mit Code ${testCode}...`);
  const result = await sendVerificationEmail(testEmail, testCode);
  if (result.success) {
    console.log("E-Mail erfolgreich gesendet! MessageID:", result.messageId);
  } else {
    console.error("Fehler beim Senden der E-Mail:", result.error);
  }
}
testEmail();