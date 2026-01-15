import Link from 'next/link';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { GameMeta, GameProgress } from '@/types/game';

interface GameCardProps {
  game: GameMeta;
  progress: GameProgress;
}

export function GameCard({ game, progress }: GameCardProps) {
  const fontClass = {
    pokemon: 'font-pokemon',
    'breath-of-the-wild': 'font-zelda',
    'elden-ring': 'font-elden',
  }[game.slug];

  return (
    <Link href={`/${game.slug}`} className="block group">
      <div className="glass-card overflow-hidden">
        {/* Background gradient placeholder */}
        <div
          className="relative h-40 -mx-6 -mt-6 mb-4 overflow-hidden"
          style={{ background: game.gradient }}
        >
          {/* Blur overlay for glassmorphism effect */}
          <div className="absolute inset-0 backdrop-blur-sm bg-black/10" />

          {/* Game title with iconic font */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h2
              className={`text-3xl md:text-4xl font-bold text-white drop-shadow-lg text-center px-4 ${fontClass}`}
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {game.name}
            </h2>
          </div>

          {/* Subtle animated gradient overlay on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(45deg, ${game.themeColor}40, transparent)`,
            }}
          />
        </div>

        {/* Progress section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-foreground/60">
              {progress.completed} / {progress.total} succès
            </span>
            <span
              className="font-semibold"
              style={{ color: game.themeColor }}
            >
              {progress.percentage}%
            </span>
          </div>
          <ProgressBar
            value={progress.percentage}
            showLabel={false}
            size="md"
            barStyle={{ backgroundColor: game.themeColor }}
          />
        </div>
      </div>
    </Link>
  );
}
