import { pgTable, text, boolean, timestamp, uuid, index } from 'drizzle-orm/pg-core';

// Achievement completion tracking
export const achievementCompletions = pgTable(
  'achievement_completions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    gameSlug: text('game_slug').notNull(), // 'pokemon' | 'breath-of-the-wild' | 'elden-ring'
    achievementId: text('achievement_id').notNull(), // Matches JSON id
    completed: boolean('completed').default(false).notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('game_achievement_idx').on(table.gameSlug, table.achievementId),
    index('game_slug_idx').on(table.gameSlug),
  ]
);

// Magic link tokens (temporary, for requesting access)
export const adminSessions = pgTable(
  'admin_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull(),
    token: text('token').notNull().unique(), // Hashed
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('token_idx').on(table.token), index('email_idx').on(table.email)]
);

// Active sessions (after magic link verification)
export const activeSessions = pgTable(
  'active_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull(),
    sessionToken: text('session_token').notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('session_token_idx').on(table.sessionToken)]
);

// Inferred types from schema
export type AchievementCompletion = typeof achievementCompletions.$inferSelect;
export type NewAchievementCompletion = typeof achievementCompletions.$inferInsert;
export type AdminSession = typeof adminSessions.$inferSelect;
export type NewAdminSession = typeof adminSessions.$inferInsert;
export type ActiveSession = typeof activeSessions.$inferSelect;
export type NewActiveSession = typeof activeSessions.$inferInsert;
