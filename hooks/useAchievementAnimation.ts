import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  CONFETTI_COUNT,
  CONFETTI_ANIMATIONS,
  ANIMATION_DURATION,
} from "@/config/confetti.config";

interface UseAchievementAnimationProps {
  isCompleted: boolean;
  isHydrated: boolean;
}

export function useAchievementAnimation({
  isCompleted,
  isHydrated,
}: UseAchievementAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prevCompletedRef = useRef<boolean>(isCompleted);
  const hasHydratedRef = useRef(false);

  // Marquer l'hydratation initiale
  useEffect(() => {
    if (isHydrated && !hasHydratedRef.current) {
      hasHydratedRef.current = true;
      prevCompletedRef.current = isCompleted;
    }
  }, [isHydrated, isCompleted]);

  useEffect(() => {
    // Ne déclencher les confettis que si :
    // 1. La page est hydratée
    // 2. Le succès vient de passer de non complété à complété
    // 3. Ce n'est pas le chargement initial
    const justCompleted =
      isCompleted && !prevCompletedRef.current && hasHydratedRef.current;

    if (justCompleted && buttonRef.current) {
      prevCompletedRef.current = isCompleted;

      // Get button position for confetti origin
      const rect = buttonRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width - 40) / window.innerWidth;
      const y = (rect.top + 40) / window.innerHeight;

      const defaults = {
        origin: { x, y },
        zIndex: 9999,
      };

      // Fire confetti with different configurations
      CONFETTI_ANIMATIONS.forEach(({ particleRatio, opts }) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(CONFETTI_COUNT * particleRatio),
        });
      });

      // Defer state update to avoid warning
      const animFrame = requestAnimationFrame(() => {
        setShowAnimation(true);
      });

      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, ANIMATION_DURATION);

      return () => {
        cancelAnimationFrame(animFrame);
        clearTimeout(timer);
      };
    } else if (!isCompleted && prevCompletedRef.current) {
      // Mettre à jour la ref si le succès est décoché
      prevCompletedRef.current = isCompleted;
    }
  }, [isCompleted]);

  return {
    showAnimation,
    buttonRef,
  };
}
