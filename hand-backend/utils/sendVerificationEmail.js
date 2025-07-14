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



const sendVerificationEmail = async (email, code) => {
  // Link zur Verifizierung im Frontend
  const verificationLink = `http://localhost:5173/verify?code=${code}&email=${encodeURIComponent(email)}`;
  const mailText = `Dein Bestätigungscode: ${code}\n\nOder klicke auf diesen Link, um deine E-Mail zu bestätigen:\n${verificationLink}`;

  await transporter.sendMail({
    from: `"Hand in Hand" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'E-Mail bestätigen',
    text: mailText
  });
  console.log(`Sende Verifizierungscode ${code} an ${email}`);
  return { success: true };
};

// export default sendVerificationEmail;
export default sendVerificationEmail;