import { AchievementCard } from './AchievementCard';
import type { Achievement, CategoryDefinition } from '@/types/achievement';

// Normalize text for accent-insensitive search
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

interface AchievementGridProps {
  achievements: Achievement[];
  categories: CategoryDefinition[];
  gameSlug: string;
  completions: Map<string, boolean>;
  isAdmin: boolean;
  filter?: 'all' | 'completed' | 'incomplete';
  categoryFilter?: string;
  searchQuery?: string;
}

export function AchievementGrid({
  achievements,
  categories,
  gameSlug,
  completions,
  isAdmin,
  filter = 'all',
  categoryFilter = 'all',
  searchQuery = '',
}: AchievementGridProps) {
  // Create a map for quick category lookup
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  // Normalize search query once
  const normalizedSearch = normalizeText(searchQuery);

  const filteredAchievements = achievements.filter((achievement) => {
    const isCompleted = completions.get(achievement.id) ?? false;

    // Status filter
    if (filter === 'completed' && !isCompleted) return false;
    if (filter === 'incomplete' && isCompleted) return false;

    // Category filter
    if (categoryFilter !== 'all' && achievement.category !== categoryFilter) return false;

    // Search filter (accent-insensitive and case-insensitive)
    if (normalizedSearch) {
      const normalizedTitle = normalizeText(achievement.title);
      const normalizedDescription = normalizeText(achievement.description);
      if (!normalizedTitle.includes(normalizedSearch) && !normalizedDescription.includes(normalizedSearch)) {
        return false;
      }
    }

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
        <h3 className="text-lg font-semibold mb-2">Aucun succes trouve</h3>
        <p className="text-foreground/60">
          {searchQuery
            ? 'Aucun succes ne correspond a votre recherche'
            : filter === 'completed'
              ? 'Aucun succes complete pour le moment'
              : filter === 'incomplete'
                ? 'Tous les succes sont deja completes !'
                : 'Aucun succes disponible'}
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
          categoryInfo={categoryMap.get(achievement.category)}
        />
      ))}
    </div>
  );
}
