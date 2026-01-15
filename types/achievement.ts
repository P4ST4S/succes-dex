export type AchievementCategory =
  | 'story'
  | 'exploration'
  | 'combat'
  | 'collection'
  | 'challenge'
  | 'secret'
  | 'multiplayer';

export type AchievementDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  difficulty?: AchievementDifficulty;
  icon?: string;
  points?: number;
  hidden?: boolean;
  prerequisiteIds?: string[];
}

export interface AchievementData {
  gameId: string;
  gameName: string;
  version: string;
  achievements: Achievement[];
}

export interface AchievementWithStatus extends Achievement {
  completed: boolean;
  completedAt?: Date | null;
}
