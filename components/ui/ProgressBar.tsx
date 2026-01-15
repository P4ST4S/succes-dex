import { cn } from '@/lib/utils/cn';

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  barStyle?: React.CSSProperties;
}

export function ProgressBar({
  value,
  className,
  color = 'bg-primary',
  showLabel = true,
  size = 'md',
  barStyle,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-foreground/70">Progression</span>
          <span className="text-sm font-semibold">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full overflow-hidden',
          'bg-foreground/10',
          sizeClasses[size]
        )}
      >
        <div
          className={cn('h-full rounded-full progress-fill', color)}
          style={{ width: `${clampedValue}%`, ...barStyle }}
        />
      </div>
    </div>
  );
}
