import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/hash';
import { signToken } from '@/lib/jwt';
import { BadRequest, InternalServerError } from '../../types/problemes';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return BadRequest({ detail: 'Email and password obligatoires' });
    }

    // already exists?
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {email, passwordHash },
    });

    const token = signToken({ sub: String(user.id), email });
    return NextResponse.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('register error', err);
        return InternalServerError({ detail: 'Internal error' + err });
  }
}