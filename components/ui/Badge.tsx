import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variantClasses = {
    default: 'bg-foreground/10 text-foreground',
    success: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
    info: 'bg-primary/20 text-primary',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
