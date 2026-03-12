import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-middleware";
import { verifyPassword, hashItem } from "@/lib/hash";
import { BadRequest, InternalServerError, NotFound, Unauthorized } from "../../types/problemes";

export const POST = withAuth(async (request: Request) => {
  try {

    const payload = (request as any).user; // payload attaché par le middleware
    const body = await request.json();
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return BadRequest({ detail: "Ancien et nouveau mot de passe requis" });
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
    if (!user) {
      return NotFound({ detail: "Utilisateur introuvable" });
    }

    // Vérifier l'ancien mot de passe
    const isValid = await verifyPassword(oldPassword, user.passwordHash);
    if (!isValid) {
      return Unauthorized({ detail: "Ancien mot de passe incorrect" });
    }

    // Hasher le nouveau mot de passe
    const newPasswordHash = await hashItem(newPassword);

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash }
    });

    return NextResponse.json({ message: "Mot de passe changé avec succès" });

  } catch (err) {
    console.error("change-password error", err);
    return InternalServerError({ detail: "Erreur serveur" });
  }
});