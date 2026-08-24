import { SignJWT, jwtVerify } from 'jose';
import type { UserRole } from './types';

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'super-secret-jwt-key';
  return new TextEncoder().encode(secret);
};

export async function signToken(payload: { userId: string; role: UserRole; email: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as { userId: string; role: UserRole; email: string };
  } catch (error) {
    return null;
  }
}
