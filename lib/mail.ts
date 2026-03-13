import nodemailer from 'nodemailer';
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `${process.env.SMTP_USER} <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  return info;
}