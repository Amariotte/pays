import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashItem, verifyPassword } from '@/lib/hash';
import { signRefreshToken, signToken } from '@/lib/jwt';
import { BadRequest, InternalServerError, Unauthorized } from '../../types/problemes';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) 
      return BadRequest({ detail: 'Email and password obligatoires' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) 
        return Unauthorized({ detail: 'Invalid credentials' });
    
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) 
      return Unauthorized({ detail: 'Invalid credentials' });
    
    const token = signToken({ sub: String(user.id), email });
    const refreshToken = signRefreshToken({ sub: String(user.id) });


    const refreshtokenHash = await hashItem(refreshToken);
    
    await prisma.refreshToken.create({
      data: {
    tokenHash: refreshtokenHash,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
});

    return NextResponse.json(
      { access_token : token , 
        refresh_token: refreshToken,
        token_type: 'Bearer', 
        expires_in: process.env.JWT_EXPIRATION || 3600, 
        user: { id: user.id, email: user.email } }
      );
  } catch (err) {
    console.error('login error', err);
    return InternalServerError({ detail: 'Internal error' + err });
  }
}