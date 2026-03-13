import nodemailer from "nodemailer";
import { mailRepo } from "@/app/repository/email.repo";

export interface SendMailParams {
  to: string;
  subject: string;
  html: string;
}

export class MailService {

  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  async send({ to, subject, html }: SendMailParams) {
      
    const message = await mailRepo.create({ to, subject, html }); // ✅ enregistrer le message en base

    try {

      await this.transporter.sendMail({
        from: `${process.env.SMTP_USER} <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });

      await mailRepo.updateStatus(message.id, "SENT");

    } catch (error: any) {

      await mailRepo.updateStatus( message.id , "FAILED", error.message)

      throw error;
    }

    return message;
  }
}

export const mailService = new MailService();