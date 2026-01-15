'use client';

import { useOptimistic, useTransition } from 'react';
import { toggleAchievement } from '@/actions/achievements';
import { cn } from '@/lib/utils/cn';

interface AchievementToggleProps {
  gameSlug: string;
  achievementId: string;
  initialCompleted: boolean;
  disabled?: boolean;
}

export function AchievementToggle({
  gameSlug,
  achievementId,
  initialCompleted,
  disabled = false,
}: AchievementToggleProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(initialCompleted);

  const handleToggle = () => {
    if (disabled) return;

    startTransition(async () => {
      setOptimisticCompleted(!optimisticCompleted);
      await toggleAchievement(gameSlug, achievementId);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={disabled || isPending}
      className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        'disabled:cursor-not-allowed',
        optimisticCompleted
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
          : 'bg-foreground/10 text-foreground/40 hover:bg-foreground/20',
        isPending && 'opacity-70'
      )}
      aria-label={optimisticCompleted ? 'Marquer comme non complété' : 'Marquer comme complété'}
    >
      {isPending ? (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : optimisticCompleted ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )}
    </button>
  );
}
