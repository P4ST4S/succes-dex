import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-card',
        !hover && 'hover:transform-none hover:shadow-none',
        className
      )}
    >
      {children}
    </div>
  );
}
