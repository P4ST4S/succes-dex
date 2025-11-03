"use client";

import { useCallback, useMemo, useState } from "react";
import { AchievementCard } from "@/components/achievement-card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Achievement } from "@/types/achievement";

const STORAGE_KEY = "mii-achievements::completed";

interface AchievementsGridProps {
  achievements: Achievement[];
  initialCompletedIds?: string[];
  readOnly?: boolean;
}

export const AchievementsGrid: React.FC<AchievementsGridProps> = ({
  achievements,
  initialCompletedIds = [],
  readOnly = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    value: localCompletedIds,
    setValue: setCompletedIds,
    reset,
    isHydrated,
  } = useLocalStorage<string[]>(STORAGE_KEY, []);

  const completedIds = readOnly ? initialCompletedIds : localCompletedIds;

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const completedCount = completedSet.size;
  const totalCount = achievements.length;

  const filteredAchievements = useMemo(() => {
    if (!searchQuery.trim()) {
      return achievements;
    }

    // Normaliser la recherche pour gérer les caractères spéciaux
    const normalizeText = (text: string) => {
      return text
        .toLowerCase()
        .normalize("NFD") // Décompose les caractères accentués
        .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
        .replace(/œ/g, "oe") // Œ → oe
        .replace(/æ/g, "ae"); // Æ → ae
    };

    const normalizedQuery = normalizeText(searchQuery);

    return achievements.filter(
      (achievement) =>
        normalizeText(achievement.title).includes(normalizedQuery) ||
        normalizeText(achievement.description).includes(normalizedQuery)
    );
  }, [achievements, searchQuery]);

  const completionRatio = useMemo(() => {
    if (totalCount === 0) {
      return 0;
    }

    return Math.round((completedCount / totalCount) * 100);
  }, [completedCount, totalCount]);

  const handleToggle = useCallback(
    (id: Achievement["id"]) => {
      setCompletedIds((previous) => {
        if (previous.includes(id)) {
          return previous.filter((entry) => entry !== id);
        }

        return [...previous, id];
      });
    },
    [setCompletedIds],
  );

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 rounded-3xl bg-white/80 px-6 py-5 shadow-mii ring-1 ring-mii-silver/70 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-mii-slate/70">
            Progression
          </p>
          <p className="text-3xl font-extrabold text-mii-ink">
            {completedCount}
            <span className="text-base font-semibold text-mii-slate/80">
              {" "}
              / {totalCount} succes
            </span>
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-mii-sky-100 px-4 py-2 text-sm font-medium text-mii-sky-800">
            <span className="size-2 rounded-full bg-mii-sky-400" aria-hidden />
            {completionRatio}% valides
          </span>
          {!readOnly && (
            <button
              type="button"
              onClick={handleReset}
              disabled={!isHydrated || completedCount === 0}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-mii-slate transition-all duration-200 hover:bg-mii-silver/60 hover:text-mii-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mii-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reinitialiser
            </button>
          )}
        </div>
      </header>

      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 text-mii-slate/60"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un succes..."
          className="w-full rounded-2xl border-2 border-mii-silver bg-white px-12 py-3 text-base text-mii-ink placeholder-mii-slate/50 transition-all duration-200 focus:border-mii-sky-400 focus:outline-none focus:ring-4 focus:ring-mii-sky-400/20"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-mii-slate/60 transition-colors hover:bg-mii-silver/50 hover:text-mii-ink"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {filteredAchievements.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-mii-silver bg-white/50 px-6 py-12 text-center">
          <div className="rounded-full bg-mii-sky-100 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-8 text-mii-sky-600"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-lg font-semibold text-mii-ink">
              Aucun succes trouve
            </p>
            <p className="text-sm text-mii-slate">
              Essaye avec d&apos;autres mots-cles
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isCompleted={completedSet.has(achievement.id)}
              onToggle={handleToggle}
              isHydrated={readOnly ? true : isHydrated}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}
    </section>
  );
};
