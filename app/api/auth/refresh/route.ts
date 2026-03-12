import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signRefreshToken, signToken } from "@/lib/jwt";
import { BadRequest, InternalServerError, Unauthorized } from "../../types/problemes";
import { hashItem } from "@/lib/hash";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const refresh_token = body.refresh_token;

    if (!refresh_token)
      return BadRequest({ detail: "Refresh token est obligatoire" });


  const hash = await hashItem(refresh_token);
  
  const storedToken = await prisma.refreshToken.findFirst({
    where: { tokenHash: hash },
    include: { user: true }
  });


    if (!storedToken)
      return Unauthorized({ detail: "Invalid refresh token" });

    if (storedToken.expiresAt < new Date())
      return Unauthorized({ detail: "Refresh token expiré" });


// Supprimer l'ancien token
await prisma.refreshToken.delete({ where: { id: storedToken.id } });

// Créer un nouveau refresh token
const newRefreshToken = signRefreshToken({ sub: String(storedToken.userId) });
const newRefreshTokenHash = await hashItem(newRefreshToken);

await prisma.refreshToken.create({
  data: {
    userId: storedToken.userId,
    tokenHash: newRefreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
  }
});

    const accessToken = signToken({
      sub: String(storedToken.userId),
      email: storedToken.user.email
    });


    // envoyer le refresh token en cookie httpOnly
  (await
      cookies()).set("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60
  });

    return NextResponse.json({
      access_token: accessToken,
      refresh_token: newRefreshToken,
      token_type: "Bearer",
      expires_in: process.env.JWT_EXPIRATION || 3600,
      user: {
        id: storedToken.user.id,
        email: storedToken.user.email
      }
    });

  } catch (err) {
    console.error("refresh error", err);
    return InternalServerError({ detail: "Internal error" });
  }
}