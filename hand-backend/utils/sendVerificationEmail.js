
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // SMTP-Server deines Mailanbieters
  port: 587, // 587 oder 465
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// const sendVerificationEmail = async (email, code) => {
//   //Hier würdest du z.B. nodemailer verwenden, um eine echte Email zu senden
//   console.log(`Sende Verifizierungscode ${code} an ${email}`);
//   //Simuliere Erfolg
//   return { success: true };
// };


const sendVerificationEmail = async (email, code) => {
  const mailText = `Dein Bestätigungscode: ${code}`;
  await transporter.sendMail({
    from: `"Hand in Hand" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Passwort zurücksetzen',
    text: mailText
  });
  console.log(`Sende Verifizierungscode ${code} an ${email}`);
  return { success: true };
};

// export default sendVerificationEmail;
export default sendVerificationEmail;