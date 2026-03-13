import { smsRepo } from "@/app/repository/sms.repo";
import { prisma } from "@/lib/prisma";

export class SmsService {

    async send({ phone, content }: { phone: string | null; content: string }) 
    {

    if (!phone) 
      throw new Error("L'utilisateur n'a pas de numéro de téléphone");
  
    const message =  await smsRepo.create( { phone, content } )

    try {
      await fetch(process.env.SMS_API_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.SMS_API_KEY}`
        },

        body: JSON.stringify({
          to: phone,
          message: content
        })
      });

      await smsRepo.updateStatus( message.id , "SENT")

    } catch (error: any) {
      await smsRepo.updateStatus( message.id , "FAILED", error.message)
      throw error;
    }

    return message;
  }
}

export const smsService = new SmsService();