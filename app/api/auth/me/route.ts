// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-middleware";
import { InternalServerError, NotFound } from "../../types/problemes";


export const GET = withAuth(async (request: NextRequest): Promise<NextResponse> => {
  try {
    const payload = (request as any).user; // ← récupère le payload attaché par le middleware


    // Récupérer l'utilisateur en base
    const dbuser = await prisma.user.findUnique({
      where: { id: Number(payload.sub) },
      select: {
        id: true,
        email: true,
        createdAt: true,
        lastName : true,
        firstName : true,
        birthDate : true,
      }
    });

    if (!dbuser) {
      return NotFound({ detail: "Utilisateur introuvable" });
    }

    const user = {
      id: dbuser.id,
      email: dbuser.email,
      lastName: dbuser.lastName,         
      firstName: dbuser.firstName,
      birthDate : dbuser.birthDate, 
    };

    return NextResponse.json({ user });

  } catch (err) {
    console.error("me endpoint error", err);
    return InternalServerError({ detail: "Erreur serveur" });
  }
});