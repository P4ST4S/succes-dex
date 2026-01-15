import { Suspense } from 'react';
import Link from 'next/link';
import { GameGallery } from '@/components/gallery/GameGallery';
import { GameCardSkeleton } from '@/components/ui/Skeleton';
import { getSession } from '@/lib/auth/session';
import { LogoutButton } from '@/components/auth/LogoutButton.client';

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <GameCardSkeleton />
      <GameCardSkeleton />
      <GameCardSkeleton />
    </div>
  );
}

export default async function HomePage() {
  const session = await getSession();

  return (
    <main className="min-h-screen p-6 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Succès
              <span className="text-primary"> Dex</span>
            </h1>
            <p className="text-foreground/60">
              Suivez la progression des succès à travers différents jeux
            </p>
          </div>

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
                Connexion Admin
              </Link>
            )}
          </div>
        </header>

        {/* Games Gallery */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Sélectionnez un jeu</h2>
          <Suspense fallback={<GallerySkeleton />}>
            <GameGallery />
          </Suspense>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-foreground/10 text-center text-sm text-foreground/50">
          <p>
            Succès Dex &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </main>
  );
}
