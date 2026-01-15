import { AchievementToggle } from './AchievementToggle.client';
import { cn } from '@/lib/utils/cn';
import type { Achievement, CategoryDefinition } from '@/types/achievement';

interface AchievementCardProps {
  achievement: Achievement;
  gameSlug: string;
  completed: boolean;
  isAdmin: boolean;
  categoryInfo?: CategoryDefinition;
}

export function AchievementCard({ achievement, gameSlug, completed, isAdmin, categoryInfo }: AchievementCardProps) {
  return (
    <div
      className={cn(
        'glass-card p-4 hover:transform-none',
        completed && 'ring-2 ring-emerald-500/30 bg-emerald-500/5'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Achievement icon */}
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
            completed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-foreground/10 text-foreground/40'
          )}
        >
          {completed ? (
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
              {achievement.title}
            </h3>
          </div>
          <p className="text-sm text-foreground/60 mb-2">{achievement.description}</p>
          {categoryInfo && (
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: categoryInfo.color }}
              >
                {categoryInfo.name}
              </span>
            </div>
          )}
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
