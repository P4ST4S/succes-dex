import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminSessions, activeSessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { generateToken, hashToken } from '@/lib/auth/magic-link';
import { AUTH_CONSTANTS } from '@/lib/auth/constants';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/verify?error=invalid', request.url));
  }

  const hashedToken = hashToken(token);

  const session = await db.query.adminSessions.findFirst({
    where: eq(adminSessions.token, hashedToken),
  });

  if (!session) {
    return NextResponse.redirect(new URL('/verify?error=invalid', request.url));
  }

  if (session.usedAt) {
    return NextResponse.redirect(new URL('/verify?error=used', request.url));
  }

  if (new Date() > session.expiresAt) {
    return NextResponse.redirect(new URL('/verify?error=expired', request.url));
  }

  // Mark magic link as used
  await db.update(adminSessions).set({ usedAt: new Date() }).where(eq(adminSessions.id, session.id));

  // Create active session
  const sessionToken = generateToken();
  const sessionExpiry = new Date(Date.now() + AUTH_CONSTANTS.SESSION_DURATION);

  await db.insert(activeSessions).values({
    email: session.email,
    sessionToken: hashToken(sessionToken),
    expiresAt: sessionExpiry,
  });

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set(AUTH_CONSTANTS.SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: sessionExpiry,
    path: '/',
  });

  return NextResponse.redirect(new URL('/', request.url));
}
