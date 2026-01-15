'use server';

import { db } from '@/lib/db';
import { adminSessions, activeSessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sendMagicLinkEmail } from '@/lib/email/resend';
import { generateToken, hashToken } from '@/lib/auth/magic-link';
import { AUTH_CONSTANTS } from '@/lib/auth/constants';
import type { MagicLinkRequestResult } from '@/types/auth';

export async function requestMagicLink(formData: FormData): Promise<MagicLinkRequestResult> {
  const email = formData.get('email') as string;
  const adminEmail = process.env.ADMIN_EMAIL;

  // Always return success to prevent email enumeration
  if (!adminEmail || email.toLowerCase() !== adminEmail.toLowerCase()) {
    return { success: true };
  }

  const token = generateToken();
  const hashedToken = hashToken(token);
  const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.MAGIC_LINK_EXPIRY);

  await db.insert(adminSessions).values({
    email,
    token: hashedToken,
    expiresAt,
  });

  // Link goes directly to the API route for verification
  const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;
  await sendMagicLinkEmail(email, magicLink);

  return { success: true };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(AUTH_CONSTANTS.SESSION_COOKIE)?.value;

  if (sessionToken) {
    const hashedToken = hashToken(sessionToken);
    await db.delete(activeSessions).where(eq(activeSessions.sessionToken, hashedToken));
  }

  cookieStore.delete(AUTH_CONSTANTS.SESSION_COOKIE);
  redirect('/');
}
