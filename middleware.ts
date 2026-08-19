import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'super-secret-jwt-key';
  return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  let userPayload: { userId: string; role: string; email: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, getSecretKey());
      userPayload = payload as any;
    } catch (e) {
      userPayload = null;
    }
  }

  // Protect /business routes
  if (pathname.startsWith('/business')) {
    if (!userPayload) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    if (userPayload.role !== 'BUSINESS_OWNER' && userPayload.role !== 'ADMIN' && userPayload.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    if (!userPayload) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    if (userPayload.role !== 'ADMIN' && userPayload.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Redirect away from login/register if already logged in
  if ((pathname === '/login' || pathname === '/register') && userPayload) {
    if (userPayload.role === 'BUSINESS_OWNER') {
      return NextResponse.redirect(new URL('/business', request.url));
    } else if (userPayload.role === 'ADMIN' || userPayload.role === 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/business/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
