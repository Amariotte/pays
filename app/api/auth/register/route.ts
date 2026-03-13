import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/hash';
import { signToken } from '@/lib/jwt';
import { BadRequest, Conflict, InternalServerError } from '../../types/problemes';
import { PLATEFORME_MESSAGE, TYPE_MESSAGE } from '@/lib/generated/prisma/enums';
import { templateService } from '@/services/messagerie.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName,lastName,birthDate } = body;

    if (!email || !password)
      return BadRequest({ detail: 'Email and mot de passe obligatoires' });

    // already exists?
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return Conflict({ detail: 'L\'email est déjà utilisé' });
    
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {email, passwordHash,firstName,lastName,birthDate },
    });

    // Optionnel : envoyer un email de bienvenue ici
    const token = signToken({ sub: String(user.id), email });
    return NextResponse.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('register error', err);
        return InternalServerError({ detail: 'Internal error' + err });
  }
}
