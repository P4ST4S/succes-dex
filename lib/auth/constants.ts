export const AUTH_CONSTANTS = {
  SESSION_COOKIE: 'streamer_session',
  MAGIC_LINK_EXPIRY: 15 * 60 * 1000, // 15 minutes
  SESSION_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;
