import { prisma } from "@/lib/prisma";
import { mailService } from "./mail.service";
import { smsService } from "./sms.service";

export class OtpService {

  OTP_LENGTH = 6;
  OTP_EXPIRATION_MINUTES = 15;

  // Générer un OTP aléatoire
  generateOtp(): string {
    return Math.floor(
      Math.pow(10, this.OTP_LENGTH - 1) +
      Math.random() * 9 * Math.pow(10, this.OTP_LENGTH - 1)
    ).toString();
  }

  // Créer et envoyer un OTP
  async sendOtp({
    email,
    phone,
    templateName = "otp"
  }: {
    email?: string;
    phone?: string;
    templateName?: string;
  }) {

    if (!email && !phone) throw new Error("Email ou téléphone requis");

    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRATION_MINUTES * 60 * 1000);

    // Enregistrer en base
    await prisma.passwordReset.create({
      data: {
        email,
        phone,
        otp,
        expiresAt
      }
    });

    const message = `Votre code OTP est ${otp}. Il expire dans ${this.OTP_EXPIRATION_MINUTES} minutes.`;

    // Envoi par email
    if (email) {
      await mailService.send({
        to: email,
        subject: "Votre code OTP",
        html: `<p>${message}</p>`
      });
    }

    // Envoi par SMS
    if (phone) {
      await smsService.sendTemplateSms({
        phone,
        templateName,
        variables: { code: otp }
      });
    }

    return otp;
  }

  // Vérifier OTP
  async verifyOtp({ email, phone, otp }: { email?: string; phone?: string; otp: string }) {

    const record = await prisma.passwordReset.findFirst({
      where: {
        otp,
        used: false,
        expiresAt: { gte: new Date() },
        OR: [
          { email },
          { phone }
        ]
      }
    });

    if (!record) return false;

    // Marquer l’OTP comme utilisé
    await prisma.passwordReset.update({
      where: { id: record.id },
      data: { used: true }
    });

    return true;
  }

  // Nettoyer les OTP expirés
  async cleanExpiredOtps() {
    await prisma.passwordReset.deleteMany({
      where: { expiresAt: { lt: new Date() }, used: false }
    });
  }
}

export const otpService = new OtpService();