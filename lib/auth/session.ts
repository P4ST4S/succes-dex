import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { activeSessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { hashToken } from './magic-link';
import { AUTH_CONSTANTS } from './constants';
import type { Session } from '@/types/auth';

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(AUTH_CONSTANTS.SESSION_COOKIE)?.value;

  if (!sessionToken) {
    return null;
  }

  const hashedToken = hashToken(sessionToken);
  const session = await db.query.activeSessions.findFirst({
    where: eq(activeSessions.sessionToken, hashedToken),
  });

  if (!session || new Date() > session.expiresAt) {
    return null;
  }

  return {
    email: session.email,
    isAdmin: session.email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase(),
  };
}

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.isAdmin ?? false;
}
