"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AchievementCard } from "@/components/achievement-card";
import { AchievementHeader } from "@/components/achievements/AchievementHeader";
import { AchievementFilters } from "@/components/achievements/AchievementFilters";
import { CategoryDivider } from "@/components/achievements/CategoryDivider";
import { StatusDivider } from "@/components/achievements/StatusDivider";
import { EmptyState } from "@/components/achievements/EmptyState";
import { useUser } from "@/hooks/useUser";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAchievementStats } from "@/hooks/useAchievementStats";
import { useAchievementFilters } from "@/hooks/useAchievementFilters";
import type { Achievement } from "@/types/achievement";
import { STORAGE_KEY } from "@/config/achievements.config";

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
  const [readOnlyCompletedIds, setReadOnlyCompletedIds] =
    useState<string[]>(initialCompletedIds);
  const { user, isLoading: isUserLoading, refreshUser } = useUser();
  const [isToggling, setIsToggling] = useState<string | null>(null);

  // LocalStorage fallback for non-authenticated users
  const {
    value: localCompletedIds,
    setValue: setLocalCompletedIds,
    reset: resetLocalStorage,
    isHydrated: isLocalHydrated,
  } = useLocalStorage<string[]>(STORAGE_KEY, []);

  // Sync readOnly completed IDs
  useEffect(() => {
    if (readOnly) {
      setReadOnlyCompletedIds(initialCompletedIds);
    }
  }, [readOnly, JSON.stringify(initialCompletedIds)]);

  // Determine which completed IDs to use
  const completedIds = readOnly
    ? readOnlyCompletedIds
    : user
      ? user.completedIds
      : localCompletedIds;

  const completedSet = new Set(completedIds);
  const isHydrated = readOnly ? true : (user ? !isUserLoading : isLocalHydrated);

  const stats = useAchievementStats({
    completedSet,
    totalCount: achievements.length,
  });

  const filters = useAchievementFilters({
    achievements,
    completedSet,
    readOnly,
  });

  const handleToggle = useCallback(
    async (id: Achievement["id"]) => {
      if (readOnly || isToggling) return;

      setIsToggling(id);

      try {
        if (user) {
          // User is authenticated - save to DB
          const response = await fetch("/api/achievements/toggle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ achievementId: id }),
          });

          if (!response.ok) {
            throw new Error("Failed to toggle achievement");
          }

          // Refresh user to get updated completedIds
          await refreshUser();
        } else {
          // User is NOT authenticated - save to localStorage only
          setLocalCompletedIds((previous) => {
            if (previous.includes(id)) {
              return previous.filter((entry) => entry !== id);
            }
            return [...previous, id];
          });
        }
      } catch (error) {
        console.error("Error toggling achievement:", error);
      } finally {
        setIsToggling(null);
      }
    },
    [user, isToggling, refreshUser, setLocalCompletedIds, readOnly]
  );

  const handleReset = useCallback(async () => {
    if (readOnly) return;

    if (user) {
      // Not implemented yet - would need a bulk delete API endpoint
      console.log("Reset not yet implemented for DB mode");
    } else {
      // Reset localStorage
      resetLocalStorage();
    }
  }, [user, readOnly, resetLocalStorage]);

  const getCategoryStats = (category: Achievement["category"]) => {
    const categoryAchievements = achievements.filter(
      (a) => a.category === category
    );
    const completed = categoryAchievements.filter((a) =>
      completedSet.has(a.id)
    ).length;
    return { completed, total: categoryAchievements.length };
  };

  const renderDividers = (
    achievement: Achievement,
    index: number,
    prevAchievement: Achievement | undefined
  ) => {
    const isCompleted = completedSet.has(achievement.id);

    // Show "Succès validés" divider in readOnly mode at the start
    const showCompletedDivider =
      readOnly &&
      filters.filterStatus === "all" &&
      index === 0 &&
      isCompleted &&
      stats.completedCount > 0;

    // Show "Succès à valider" divider when transitioning from completed to incomplete
    const showIncompleteDivider =
      readOnly &&
      filters.filterStatus === "all" &&
      index > 0 &&
      prevAchievement &&
      completedSet.has(prevAchievement.id) &&
      !isCompleted;

    // Show category dividers when showing all categories
    // BUT don't show at index 0 if we're already showing a status divider in readOnly mode
    const showCategoryDivider =
      filters.filterCategory === null &&
      (index === 0 ? !showCompletedDivider :
        (prevAchievement && achievement.category !== prevAchievement.category));

    const categoryStats = showCategoryDivider
      ? getCategoryStats(achievement.category)
      : null;

    return (
      <>
        {showCompletedDivider && (
          <StatusDivider title="Succes valides" type="completed" />
        )}
        {showIncompleteDivider && (
          <StatusDivider title="Succes a valider" type="incomplete" />
        )}
        {showCategoryDivider && categoryStats && (
          <CategoryDivider
            category={achievement.category}
            completed={categoryStats.completed}
            total={categoryStats.total}
          />
        )}
      </>
    );
  };

  const hasActiveFilters =
    filters.filterStatus !== "all" || filters.filterCategory !== null;

  return (
    <section className="flex flex-col gap-6">
      <AchievementHeader
        completedCount={stats.completedCount}
        totalCount={stats.totalCount}
        completionRatio={stats.completionRatio}
        onReset={handleReset}
        readOnly={readOnly}
        isHydrated={isHydrated}
      />

      <AchievementFilters
        searchQuery={filters.searchQuery}
        onSearchChange={filters.setSearchQuery}
        filterStatus={filters.filterStatus}
        onStatusChange={filters.setFilterStatus}
        filterCategory={filters.filterCategory}
        onCategoryChange={filters.setFilterCategory}
        readOnly={readOnly}
      />

      {filters.filteredAchievements.length === 0 ? (
        <EmptyState
          searchQuery={filters.searchQuery}
          hasActiveFilters={hasActiveFilters}
        />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            {filters.filteredAchievements.map((achievement, index) => {
              const prevAchievement = filters.filteredAchievements[index - 1];
              const isCompleted = completedSet.has(achievement.id);

              return (
                <React.Fragment key={achievement.id}>
                  {renderDividers(achievement, index, prevAchievement)}
                  <AchievementCard
                    achievement={achievement}
                    isCompleted={isCompleted}
                    onToggle={handleToggle}
                    isHydrated={readOnly ? true : isHydrated}
                    readOnly={readOnly}
                    isLoading={isToggling === achievement.id}
                    disabled={isToggling !== null && isToggling !== achievement.id}
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
