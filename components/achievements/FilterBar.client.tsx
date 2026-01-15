'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

type FilterStatus = 'all' | 'completed' | 'incomplete';

const filters: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'completed', label: 'Complétés' },
  { value: 'incomplete', label: 'À faire' },
];

export function FilterBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentFilter = (searchParams.get('filter') as FilterStatus) || 'all';

  const setFilter = (filter: FilterStatus) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === 'all') {
      params.delete('filter');
    } else {
      params.set('filter', filter);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm text-foreground/60 mr-2">Filtrer :</span>
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            currentFilter === value
              ? 'bg-primary text-white shadow-lg shadow-primary/30'
              : 'bg-foreground/5 text-foreground/70 hover:bg-foreground/10'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
