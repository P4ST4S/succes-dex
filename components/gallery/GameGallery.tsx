import { GameCard } from './GameCard';
import { GAMES } from '@/data/games';
import { getAllGamesProgress } from '@/actions/achievements';
import type { GameProgress } from '@/types/game';

export async function GameGallery() {
  const progressData = await getAllGamesProgress();

  const gamesWithProgress = GAMES.map((game) => {
    const data = progressData[game.slug] || { completed: 0, total: game.achievementCount };
    const progress: GameProgress = {
      completed: data.completed,
      total: data.total,
      percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    };
    return { game, progress };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gamesWithProgress.map(({ game, progress }) => (
        <GameCard key={game.slug} game={game} progress={progress} />
      ))}
    </div>
  );
}
