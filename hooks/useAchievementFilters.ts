import { useState, useMemo } from "react";
import type { Achievement, AchievementCategory } from "@/types/achievement";
import { normalizeText } from "@/lib/text.utils";
import { CATEGORY_ORDER } from "@/config/achievements.config";

type FilterStatus = "all" | "completed" | "incomplete";

interface UseAchievementFiltersProps {
  achievements: Achievement[];
  completedSet: Set<string>;
  readOnly?: boolean;
}

export function useAchievementFilters({
  achievements,
  completedSet,
  readOnly = false,
}: UseAchievementFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterCategory, setFilterCategory] =
    useState<AchievementCategory | null>(null);

  const filteredAchievements = useMemo(() => {
    let filtered = [...achievements];

    // Filtrage par recherche
    if (searchQuery.trim()) {
      const normalizedQuery = normalizeText(searchQuery);
      filtered = filtered.filter((achievement) => {
        const normalizedTitle = normalizeText(achievement.title);
        const normalizedDescription = normalizeText(achievement.description);
        return (
          normalizedTitle.includes(normalizedQuery) ||
          normalizedDescription.includes(normalizedQuery)
        );
      });
    }

    // Filtrage par statut
    if (filterStatus === "completed") {
      filtered = filtered.filter((a) => completedSet.has(a.id));
    } else if (filterStatus === "incomplete") {
      filtered = filtered.filter((a) => !completedSet.has(a.id));
    }

    // Filtrage par catégorie
    if (filterCategory) {
      filtered = filtered.filter((a) => a.category === filterCategory);
    }

    // Tri
    if (readOnly) {
      filtered.sort((a, b) => {
        // 1. Trier par statut (complétés en premier)
        const aCompleted = completedSet.has(a.id);
        const bCompleted = completedSet.has(b.id);
        if (aCompleted !== bCompleted) {
          return aCompleted ? -1 : 1;
        }
        // 2. Trier par catégorie
        const categoryComparison =
          CATEGORY_ORDER.indexOf(a.category) -
          CATEGORY_ORDER.indexOf(b.category);
        if (categoryComparison !== 0) {
          return categoryComparison;
        }
        // 3. Trier par titre
        return a.title.localeCompare(b.title);
      });
    } else {
      filtered.sort((a, b) => {
        const categoryComparison =
          CATEGORY_ORDER.indexOf(a.category) -
          CATEGORY_ORDER.indexOf(b.category);
        if (categoryComparison !== 0) {
          return categoryComparison;
        }
        return a.title.localeCompare(b.title);
      });
    }

    return filtered;
  }, [
    achievements,
    searchQuery,
    filterStatus,
    filterCategory,
    completedSet,
    readOnly,
  ]);

  return {
    filteredAchievements,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterCategory,
    setFilterCategory,
  };
}
