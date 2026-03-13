import { hashPassword } from "@/lib/hash";
import { BadRequest, InternalServerError, Unauthorized } from "../../types/problemes";
import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { email, newPassword, token } = body;

    if (!email || !newPassword || !token)
      return BadRequest({ detail: "Email, nouveau mot de passe et token requis" });

    const tokenHash = await hashPassword(token); // Hash du token pour comparaison sécurisée
    // Vérifier le token dans ta table passwordReset ou JWT
    const reset = await prisma.passwordReset.findUnique({ where: { tokenHash , email , used : false} });
    if (!reset)
      return Unauthorized({ detail: "Token invalide ou expiré" });

    // Hasher le nouveau mot de passe
    const newPasswordHash = await hashPassword(newPassword);

    // Mettre à jour l'utilisateur
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash: newPasswordHash,
        lastPasswordUpdatedAt: new Date(),
      },
    });

    // Marquer le token comme utilisé
    await prisma.passwordReset.update({
      where: { tokenHash },
      data: { used: true },
    });

    return NextResponse.json({ message: "Mot de passe réinitialisé avec succès" });

  } catch (err) {
    console.error("reset-password error", err);
    return InternalServerError({ detail: "Erreur serveur" });
  }
};