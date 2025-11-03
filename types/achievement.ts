export type AchievementCategory =
  | "Intrigue"
  | "Pokémon"
  | "Quêtes"
  | "Collection"
  | "Divers";
  
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
}
