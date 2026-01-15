'use server';

import { db } from '@/lib/db';
import { achievementCompletions } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/auth/session';
import type { AchievementData } from '@/types/achievement';
import type { GameSlug } from '@/types/game';

// Toggle achievement completion (admin only)
export async function toggleAchievement(
  gameSlug: string,
  achievementId: string
): Promise<{ success: boolean; completed: boolean; error?: string }> {
  const admin = await isAdmin();

  if (!admin) {
    return { success: false, completed: false, error: 'Non autorisé' };
  }

  const existing = await db.query.achievementCompletions.findFirst({
    where: and(
      eq(achievementCompletions.gameSlug, gameSlug),
      eq(achievementCompletions.achievementId, achievementId)
    ),
  });

  const newCompleted = !existing?.completed;

  if (existing) {
    await db
      .update(achievementCompletions)
      .set({
        completed: newCompleted,
        completedAt: newCompleted ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(achievementCompletions.id, existing.id));
  } else {
    await db.insert(achievementCompletions).values({
      gameSlug,
      achievementId,
      completed: true,
      completedAt: new Date(),
    });
  }

  revalidatePath(`/${gameSlug}`);
  revalidatePath('/');

  return { success: true, completed: newCompleted };
}

// Get completion status for a game (public read)
export async function getCompletionStatus(gameSlug: string): Promise<Map<string, boolean>> {
  const completions = await db.query.achievementCompletions.findMany({
    where: eq(achievementCompletions.gameSlug, gameSlug),
  });

  return new Map(completions.map((c) => [c.achievementId, c.completed]));
}

// Get achievements data from JSON file
export async function getAchievementsForGame(gameSlug: GameSlug): Promise<AchievementData> {
  const data = await import(`@/data/achievements/${gameSlug}.json`);
  return data.default as AchievementData;
}

// Get progress stats for all games (for home gallery)
export async function getAllGamesProgress(): Promise<
  Record<string, { completed: number; total: number }>
> {
  const completions = await db.query.achievementCompletions.findMany({
    where: eq(achievementCompletions.completed, true),
  });

  // Group by game
  const byGame = completions.reduce(
    (acc, c) => {
      acc[c.gameSlug] = (acc[c.gameSlug] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Load totals from JSON definitions
  const games: GameSlug[] = ['pokemon', 'breath-of-the-wild', 'elden-ring'];
  const totals: Record<string, number> = {};

  for (const slug of games) {
    const data = await getAchievementsForGame(slug);
    totals[slug] = data.achievements.length;
  }

  return Object.fromEntries(
    games.map((slug) => [
      slug,
      {
        completed: byGame[slug] || 0,
        total: totals[slug],
      },
    ])
  );
}
