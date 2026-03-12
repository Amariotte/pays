import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";


export interface JWTPayload {
  sub: string; // subject (user id or similar)
  [key: string]: any;
}

export function signToken(payload: JWTPayload, options?: jwt.SignOptions) {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: REFRESH_EXPIRES,
    ...options,
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JWTPayload;
  } catch (err) {
    return null;
  }
}

// REFRESH TOKEN
export function signRefreshToken(payload: JWTPayload) {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES
  });
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}
