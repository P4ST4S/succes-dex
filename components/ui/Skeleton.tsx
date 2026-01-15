import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-foreground/10',
        className
      )}
    />
  );
}

export function GameCardSkeleton() {
  return (
    <div className="glass-card hover:transform-none">
      <Skeleton className="h-40 w-full rounded-xl mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-2.5 w-full rounded-full" />
    </div>
  );
}

export function AchievementCardSkeleton() {
  return (
    <div className="glass-card hover:transform-none p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
    </div>
  );
}
