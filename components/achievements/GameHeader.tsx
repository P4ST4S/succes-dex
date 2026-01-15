import Link from 'next/link';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LogoutButton } from '@/components/auth/LogoutButton.client';
import type { GameMeta, GameProgress } from '@/types/game';
import type { Session } from '@/types/auth';

interface GameHeaderProps {
  game: GameMeta;
  progress: GameProgress;
  session: Session | null;
}

export function GameHeader({ game, progress, session }: GameHeaderProps) {
  const fontClass = {
    pokemon: 'font-pokemon',
    'breath-of-the-wild': 'font-zelda',
    'elden-ring': 'font-elden',
  }[game.slug];

  return (
    <header className="mb-8">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </Link>

        <div className="flex items-center gap-4">
          {session?.isAdmin && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
              Admin
            </span>
          )}
          {session?.isAdmin ? (
            <LogoutButton />
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>

      {/* Game title with background image */}
      <div
        className="relative rounded-2xl overflow-hidden p-8 mb-6 bg-cover bg-center"
        style={{ 
          backgroundImage: game.backgroundImage 
            ? `url(${game.backgroundImage})` 
            : game.gradient,
          backgroundColor: game.themeColor 
        }}
      >
        <div className="absolute inset-0 backdrop-blur-[1.5px] bg-black/5" />
        <div className="relative text-center">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg ${fontClass}`}
            style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}
          >
            {game.name}
          </h1>
        </div>
      </div>

      {/* Progress stats */}
      <div className="glass-card hover:transform-none">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">
              {progress.completed}{' '}
              <span className="text-foreground/60 font-normal">/ {progress.total}</span>
            </p>
            <p className="text-foreground/60">succès débloqués</p>
          </div>
          <div className="flex-1 max-w-md">
            <ProgressBar
              value={progress.percentage}
              size="lg"
              barStyle={{ backgroundColor: game.themeColor }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
