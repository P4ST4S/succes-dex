"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AchievementCard } from "@/components/achievement-card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Achievement } from "@/types/achievement";

const STORAGE_KEY = "mii-achievements::completed";

interface AchievementsGridProps {
  achievements: Achievement[];
  initialCompletedIds?: string[];
  readOnly?: boolean;
}

type FilterStatus = "all" | "completed" | "incomplete";

export const AchievementsGrid: React.FC<AchievementsGridProps> = ({
  achievements,
  initialCompletedIds = [],
  readOnly = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [readOnlyCompletedIds, setReadOnlyCompletedIds] = useState<string[]>(initialCompletedIds);
  const {
    value: localCompletedIds,
    setValue: setCompletedIds,
    reset,
    isHydrated,
  } = useLocalStorage<string[]>(STORAGE_KEY, []);

  // Sync readOnly completed IDs when they change
  useEffect(() => {
    if (readOnly) {
      setReadOnlyCompletedIds(initialCompletedIds);
    }
  }, [readOnly, JSON.stringify(initialCompletedIds)]);

  const completedIds = readOnly ? readOnlyCompletedIds : localCompletedIds;

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const completedCount = completedSet.size;
  const totalCount = achievements.length;

  const filteredAchievements = useMemo(() => {
    // Normaliser la recherche pour gérer les caractères spéciaux
    const normalizeText = (text: string) => {
      return text
        .toLowerCase()
        .normalize("NFD") // Décompose les caractères accentués
        .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
        .replace(/œ/g, "oe") // Œ → oe
        .replace(/æ/g, "ae"); // Æ → ae
    };

    let filtered = achievements;

    // Filtrer par texte de recherche
    if (searchQuery.trim()) {
      const normalizedQuery = normalizeText(searchQuery);
      filtered = filtered.filter(
        (achievement) =>
          normalizeText(achievement.title).includes(normalizedQuery) ||
          normalizeText(achievement.description).includes(normalizedQuery)
      );
    }

    // Filtrer par statut
    if (filterStatus === "completed") {
      filtered = filtered.filter((achievement) =>
        completedSet.has(achievement.id)
      );
    } else if (filterStatus === "incomplete") {
      filtered = filtered.filter(
        (achievement) => !completedSet.has(achievement.id)
      );
    }

    // En mode lecture seule, trier les succès validés en premier
    if (readOnly) {
      filtered = [...filtered].sort((a, b) => {
        const aCompleted = completedSet.has(a.id);
        const bCompleted = completedSet.has(b.id);
        if (aCompleted && !bCompleted) return -1;
        if (!aCompleted && bCompleted) return 1;
        return 0;
      });
    }

    return filtered;
  }, [achievements, searchQuery, filterStatus, completedSet, readOnly]);

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

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
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

        {readOnly && (
          <div className="flex gap-2 rounded-2xl border-2 border-mii-silver bg-white p-1">
            <button
              type="button"
              onClick={() => setFilterStatus("all")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                filterStatus === "all"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-mii-slate hover:bg-mii-silver/50"
              }`}
            >
              Tous
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("completed")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                filterStatus === "completed"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-mii-slate hover:bg-mii-silver/50"
              }`}
            >
              Valides
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("incomplete")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                filterStatus === "incomplete"
                  ? "bg-gray-600 text-white shadow-sm"
                  : "text-mii-slate hover:bg-mii-silver/50"
              }`}
            >
              Non valides
            </button>
          </div>
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
        <div className="flex flex-col gap-6">
          {readOnly && filterStatus === "all" && completedCount > 0 && (
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Succes valides
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-green-200 to-transparent" />
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {filteredAchievements.map((achievement, index) => {
              const isCompleted = completedSet.has(achievement.id);
              const prevAchievement = filteredAchievements[index - 1];
              const showDivider =
                readOnly &&
                filterStatus === "all" &&
                index > 0 &&
                prevAchievement &&
                completedSet.has(prevAchievement.id) &&
                !isCompleted;

              return (
                <React.Fragment key={achievement.id}>
                  {showDivider && (
                    <div className="col-span-full flex items-center gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-mii-slate/10 px-4 py-2 text-sm font-semibold text-mii-slate">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-4"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="16" />
                          <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        Succes a valider
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-mii-slate/20 to-transparent" />
                    </div>
                  )}
                  <AchievementCard
                    achievement={achievement}
                    isCompleted={isCompleted}
                    onToggle={handleToggle}
                    isHydrated={readOnly ? true : isHydrated}
                    readOnly={readOnly}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
