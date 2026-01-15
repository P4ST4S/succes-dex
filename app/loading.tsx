import { Skeleton, GameCardSkeleton } from '@/components/ui/Skeleton';

export default function HomeLoading() {
  return (
    <main className="min-h-screen p-6 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header skeleton */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <div>
            <Skeleton className="h-10 w-80 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </header>

        {/* Section title skeleton */}
        <Skeleton className="h-7 w-48 mb-6" />

        {/* Games gallery skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GameCardSkeleton />
          <GameCardSkeleton />
          <GameCardSkeleton />
        </div>
      </div>
    </main>
  );
}
