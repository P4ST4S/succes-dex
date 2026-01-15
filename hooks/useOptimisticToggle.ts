'use client';

import { useOptimistic, useTransition } from 'react';
import { toggleAchievement } from '@/actions/achievements';

export function useOptimisticToggle(
  gameSlug: string,
  achievementId: string,
  initialCompleted: boolean
) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(initialCompleted);

  const toggle = () => {
    startTransition(async () => {
      const newValue = !optimisticCompleted;
      setOptimisticCompleted(newValue);

      try {
        await toggleAchievement(gameSlug, achievementId);
      } catch (error) {
        // Revalidation will restore correct state
        console.error('Toggle failed:', error);
      }
    });
  };

  return {
    completed: optimisticCompleted,
    isPending,
    toggle,
  };
}
