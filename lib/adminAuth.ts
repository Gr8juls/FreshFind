import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'] as const;

/**
 * Verifies that the caller has an ADMIN or SUPER_ADMIN role.
 * Returns the decoded payload, or a 401/403 NextResponse if access is denied.
 */
export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return {
      error: NextResponse.json({ error: 'Unauthenticated' }, { status: 401 }),
      payload: null,
    };
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return {
      error: NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 }),
      payload: null,
    };
  }

  if (!ADMIN_ROLES.includes(payload.role as any)) {
    return {
      error: NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 }),
      payload: null,
    };
  }

  return { error: null, payload };
}
