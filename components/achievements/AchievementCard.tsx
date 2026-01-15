import { Badge } from '@/components/ui/Badge';
import { AchievementToggle } from './AchievementToggle.client';
import { cn } from '@/lib/utils/cn';
import type { Achievement, AchievementCategory, AchievementDifficulty } from '@/types/achievement';

interface AchievementCardProps {
  achievement: Achievement;
  gameSlug: string;
  completed: boolean;
  isAdmin: boolean;
}

const categoryLabels: Record<AchievementCategory, string> = {
  story: 'Histoire',
  exploration: 'Exploration',
  combat: 'Combat',
  collection: 'Collection',
  challenge: 'Défi',
  secret: 'Secret',
  multiplayer: 'Multijoueur',
};

const categoryColors: Record<AchievementCategory, string> = {
  story: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  exploration: 'bg-green-500/20 text-green-600 dark:text-green-400',
  combat: 'bg-red-500/20 text-red-600 dark:text-red-400',
  collection: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
  challenge: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
  secret: 'bg-pink-500/20 text-pink-600 dark:text-pink-400',
  multiplayer: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400',
};

const difficultyLabels: Record<AchievementDifficulty, string> = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
  legendary: 'Légendaire',
};

const difficultyColors: Record<AchievementDifficulty, string> = {
  easy: 'text-emerald-500',
  medium: 'text-amber-500',
  hard: 'text-orange-500',
  legendary: 'text-purple-500',
};

export function AchievementCard({ achievement, gameSlug, completed, isAdmin }: AchievementCardProps) {
  const isHidden = achievement.hidden && !completed;

  return (
    <div
      className={cn(
        'glass-card p-4 hover:transform-none',
        completed && 'ring-2 ring-emerald-500/30 bg-emerald-500/5',
        isHidden && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Achievement icon placeholder */}
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
            completed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-foreground/10 text-foreground/40'
          )}
        >
          {isHidden ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : completed ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className={cn('font-semibold', completed && 'text-emerald-600 dark:text-emerald-400')}>
              {isHidden ? '???' : achievement.name}
            </h3>
            {achievement.difficulty && !isHidden && (
              <span className={cn('text-xs font-medium', difficultyColors[achievement.difficulty])}>
                {difficultyLabels[achievement.difficulty]}
              </span>
            )}
          </div>
          <p className="text-sm text-foreground/60 mb-2">
            {isHidden ? 'Débloquez ce succès pour révéler sa description' : achievement.description}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn('text-xs px-2 py-0.5 rounded-full', categoryColors[achievement.category])}>
              {categoryLabels[achievement.category]}
            </span>
            {achievement.points && !isHidden && (
              <Badge variant="info">{achievement.points} pts</Badge>
            )}
          </div>
        </div>

        {/* Toggle button (admin only) */}
        {isAdmin && (
          <AchievementToggle
            gameSlug={gameSlug}
            achievementId={achievement.id}
            initialCompleted={completed}
          />
        )}

        {/* Completed indicator (non-admin) */}
        {!isAdmin && completed && (
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
