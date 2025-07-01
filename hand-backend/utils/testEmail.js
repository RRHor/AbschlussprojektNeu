import { sendVerificationEmail } from './emailService.js';
import dotenv from 'dotenv';


// Lade Umgebungsvariablen
dotenv.config();

// Test-Funktion für E-Mail-Versand
async function testEmail() {
  const testCode = "123456";
  const testUserId = "test-user-id-123"; // Dummy UserID für Test
  const testEmail = "ciyew82909@jio1.com";
  
  console.log(`Sende Test-E-Mail an ${testEmail} mit Code ${testCode}...`);
  
  // Korrekte Parameter-Anzahl
  const result = await sendVerificationEmail(testEmail, testCode, testUserId);
  
  if (result.success) {
    console.log("✅ E-Mail erfolgreich gesendet! MessageID:", result.messageId);
  } else {
    console.error("❌ Fehler beim Senden der E-Mail:", result.error);
  }
}

testEmail();