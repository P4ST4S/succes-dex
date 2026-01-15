export interface CategoryDefinition {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface AchievementData {
  gameId: string;
  gameName: string;
  version: string;
  background?: string;
  categories: CategoryDefinition[];
  achievements: Achievement[];
}

export interface AchievementWithStatus extends Achievement {
  completed: boolean;
  completedAt?: Date | null;
}
