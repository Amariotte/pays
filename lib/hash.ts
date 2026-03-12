import bcrypt from 'bcryptjs';
import crypto from "crypto";


export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function hashItem(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
