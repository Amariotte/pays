import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashItem } from "@/lib/hash";
import { BadRequest } from "../../types/problemes";

export async function POST(request: Request) {
  const body = await request.json();
  const refresh_token = body.refresh_token;

  if (!refresh_token) {
    return BadRequest({ detail: "Refresh token obligatoire" });
  }

  const hash = await hashItem(refresh_token);

  // supprimer le token de la base
  await prisma.refreshToken.deleteMany({ where: { tokenHash: hash } });

  return NextResponse.json({ message :"Déconnexion réussie" });
}