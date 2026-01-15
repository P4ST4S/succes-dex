import { Skeleton, AchievementCardSkeleton } from '@/components/ui/Skeleton';

export default function GameLoading() {
  return (
    <main className="min-h-screen p-6 md:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header skeleton */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Game title banner skeleton */}
          <Skeleton className="h-40 w-full rounded-2xl mb-6" />

          {/* Progress skeleton */}
          <div className="glass-card hover:transform-none">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex-1 max-w-md">
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
            </div>
          </div>
        </header>

        {/* Filter skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
        </div>

        {/* Achievements skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <AchievementCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
