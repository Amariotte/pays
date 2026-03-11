import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'default_secret'; // ✅ fail-safe avec une valeur par défaut, mais à éviter en production
const EXPIRES_IN = '1h'; // default expiration

export interface JWTPayload {
  sub: string; // subject (user id or similar)
  [key: string]: any;
}

export function signToken(payload: JWTPayload, options?: jwt.SignOptions) {
  return jwt.sign(payload, SECRET, {
    expiresIn: EXPIRES_IN,
    ...options,
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as JWTPayload;
  } catch (err) {
    return null;
  }
}
