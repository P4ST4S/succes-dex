import { AchievementCard } from './AchievementCard';
import type { Achievement } from '@/types/achievement';

interface AchievementGridProps {
  achievements: Achievement[];
  gameSlug: string;
  completions: Map<string, boolean>;
  isAdmin: boolean;
  filter?: 'all' | 'completed' | 'incomplete';
}

export function AchievementGrid({
  achievements,
  gameSlug,
  completions,
  isAdmin,
  filter = 'all',
}: AchievementGridProps) {
  const filteredAchievements = achievements.filter((achievement) => {
    const isCompleted = completions.get(achievement.id) ?? false;
    if (filter === 'completed') return isCompleted;
    if (filter === 'incomplete') return !isCompleted;
    return true;
  });

  if (filteredAchievements.length === 0) {
    return (
      <div className="glass-card text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Aucun succès trouvé</h3>
        <p className="text-foreground/60">
          {filter === 'completed'
            ? 'Aucun succès complété pour le moment'
            : filter === 'incomplete'
              ? 'Tous les succès sont déjà complétés !'
              : 'Aucun succès disponible'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {filteredAchievements.map((achievement) => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          gameSlug={gameSlug}
          completed={completions.get(achievement.id) ?? false}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}
