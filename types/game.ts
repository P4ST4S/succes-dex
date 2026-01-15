export type GameSlug = 'pokemon' | 'breath-of-the-wild' | 'elden-ring';

export interface GameMeta {
  slug: GameSlug;
  name: string;
  fontFamily: string;
  gradient: string; // Gradient placeholder fallback
  backgroundImage?: string; // Real background image
  themeColor: string;
  achievementCount: number;
}

export interface GameProgress {
  completed: number;
  total: number;
  percentage: number;
}

export interface GameWithProgress extends GameMeta {
  progress: GameProgress;
}
