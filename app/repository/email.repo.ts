import { prisma } from "@/lib/prisma";

export interface SendMailParams {
  to: string;
  subject: string;
  html: string;
}

export class MailRepo {

  
  async create({ to, subject, html }: SendMailParams) 
  {
    const message = await prisma.messageEmail.create({
      data: {
        to,
        subject,
        content: html,
        status: "PENDING",
      },
    });

    return message;
  }

  async updateStatus( id: number, status: "SENT" | "FAILED", error?: string) 
  {
      const message = await prisma.messageEmail.update({
        where: { id: id },
        data: {
          status: status,
          sentAt: new Date(),
          error: error
        },
    });

    return message;
  }
  
}

export const mailRepo = new MailRepo();