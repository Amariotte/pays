import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { Unauthorized } from '@/app/api/types/problemes';


export function verifyBearerToken(request: NextRequest): { msg: string | null, payload: any | null } {
  
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return { msg: 'Bearer token manquant ou invalide. Utilisez le header Authorization: Bearer <token>', payload: null };
  
  const token = authHeader.slice(7); // remove "Bearer "
  
  try {
    const payload = verifyToken(token);
    if (!payload) 
      return { msg: 'Token invalide.', payload: null };
    else
      return { msg: null, payload: payload };
  } catch (err) {
    return { msg: 'Token invalide.', payload: null };
  }
}

export function withAuth(handler: (request: NextRequest, context?: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context?: any) => {
    const result = verifyBearerToken(request);

    if (result.msg)
      return Unauthorized({ detail: result.msg, instance: request.url });
    
    // attach payload to request for use in handler
    (request as any).user = result.payload;
    
    return handler(request, context);
  };
}
