import type { GameMeta, GameSlug } from '@/types/game';

export const GAMES: GameMeta[] = [
  {
    slug: 'pokemon',
    name: 'Pokémon',
    fontFamily: 'var(--font-pokemon)',
    gradient: 'linear-gradient(135deg, #FFCB05 0%, #3D7DCA 50%, #003A70 100%)',
    backgroundImage: '/backgrounds/pokemon-bg.webp',
    themeColor: '#FFCB05',
    achievementCount: 113,
  },
  {
    slug: 'breath-of-the-wild',
    name: 'Breath of the Wild',
    fontFamily: 'var(--font-zelda)',
    gradient: 'linear-gradient(135deg, #1B813E 0%, #8BC34A 50%, #4CAF50 100%)',
    backgroundImage: '/backgrounds/botw-bg.webp',
    themeColor: '#1B813E',
    achievementCount: 105,
  },
  {
    slug: 'elden-ring',
    name: 'Elden Ring',
    fontFamily: 'var(--font-elden)',
    gradient: 'linear-gradient(135deg, #C5A036 0%, #8B7355 50%, #2C2416 100%)',
    backgroundImage: '/backgrounds/elden-ring-bg.webp',
    themeColor: '#C5A036',
    achievementCount: 52,
  },
];

export function getGameBySlug(slug: string): GameMeta | undefined {
  return GAMES.find((g) => g.slug === slug);
}

export function isValidGameSlug(slug: string): slug is GameSlug {
  return GAMES.some((g) => g.slug === slug);
}
