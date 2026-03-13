import { prisma } from "@/lib/prisma";

export interface SendSMSParams {
  phone: string;
  content: string;
}

export class SMSRepo {

  
  async create({ phone, content }: SendSMSParams) 
  {
    const message = await prisma.smsMessage.create({
      data: {
        phone,
        content,
        status: "PENDING",
      },
    });

    return message;
  }

  async updateStatus( id: number, status: "SENT" | "FAILED", error?: string) 
  {
      const message = await prisma.smsMessage.update({
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

export const smsRepo = new SMSRepo();