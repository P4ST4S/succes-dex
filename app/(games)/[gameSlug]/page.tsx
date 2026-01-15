import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { GameHeader } from '@/components/achievements/GameHeader';
import { AchievementGrid } from '@/components/achievements/AchievementGrid';
import { FilterBar } from '@/components/achievements/FilterBar.client';
import { AchievementCardSkeleton } from '@/components/ui/Skeleton';
import { getAchievementsForGame, getCompletionStatus } from '@/actions/achievements';
import { getGameBySlug, isValidGameSlug } from '@/data/games';
import { getSession } from '@/lib/auth/session';
import type { GameSlug } from '@/types/game';

interface GamePageProps {
  params: Promise<{ gameSlug: string }>;
  searchParams: Promise<{ filter?: string }>;
}

function AchievementsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[...Array(6)].map((_, i) => (
        <AchievementCardSkeleton key={i} />
      ))}
    </div>
  );
}

export async function generateMetadata({ params }: GamePageProps) {
  const { gameSlug } = await params;

  if (!isValidGameSlug(gameSlug)) {
    return { title: 'Jeu non trouvé' };
  }

  const game = getGameBySlug(gameSlug);
  return {
    title: `${game?.name} - Succès | Streamer Achievement Encyclopedia`,
    description: `Suivez la progression des succès de ${game?.name}`,
  };
}

export default async function GamePage({ params, searchParams }: GamePageProps) {
  const { gameSlug } = await params;
  const { filter } = await searchParams;

  if (!isValidGameSlug(gameSlug)) {
    notFound();
  }

  const game = getGameBySlug(gameSlug);
  if (!game) {
    notFound();
  }

  const [achievementData, completionMap, session] = await Promise.all([
    getAchievementsForGame(gameSlug as GameSlug),
    getCompletionStatus(gameSlug),
    getSession(),
  ]);

  const completedCount = Array.from(completionMap.values()).filter(Boolean).length;
  const progress = {
    completed: completedCount,
    total: achievementData.achievements.length,
    percentage:
      achievementData.achievements.length > 0
        ? Math.round((completedCount / achievementData.achievements.length) * 100)
        : 0,
  };

  const filterStatus = (filter as 'all' | 'completed' | 'incomplete') || 'all';

  return (
    <main className="min-h-screen p-6 md:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <GameHeader game={game} progress={progress} session={session} />

        <FilterBar />

        <Suspense fallback={<AchievementsSkeleton />}>
          <AchievementGrid
            achievements={achievementData.achievements}
            gameSlug={gameSlug}
            completions={completionMap}
            isAdmin={session?.isAdmin ?? false}
            filter={filterStatus}
          />
        </Suspense>
      </div>
    </main>
  );
}
