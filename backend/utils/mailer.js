import nodemailer from 'nodemailer';

export const sendMail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use your SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"NGO Donation Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error('❌ Email sending failed:', err);
  }
};
