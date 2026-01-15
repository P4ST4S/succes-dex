'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';
import type { CategoryDefinition } from '@/types/achievement';

type FilterStatus = 'all' | 'completed' | 'incomplete';

const statusFilters: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'completed', label: 'Complets' },
  { value: 'incomplete', label: 'Restants' },
];

interface FilterBarProps {
  categories: CategoryDefinition[];
}

// Normalize text for accent-insensitive search
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function FilterBar({ categories }: FilterBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentFilter = (searchParams.get('filter') as FilterStatus) || 'all';
  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';

  const [searchValue, setSearchValue] = useState(currentSearch);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'all') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // Real-time search with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (searchValue !== currentSearch) {
        updateParams({ search: searchValue || null });
      }
    }, 200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchValue, currentSearch, updateParams]);

  const setFilter = (filter: FilterStatus) => {
    updateParams({ filter: filter === 'all' ? null : filter });
  };

  const setCategory = (category: string) => {
    updateParams({ category: category === 'all' ? null : category });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue('');
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Search bar */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Rechercher un succes..."
          className="w-full pl-12 pr-12 py-3 rounded-xl bg-foreground/5 border border-foreground/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-foreground/40"
        />
        {searchValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-foreground/60 mr-1">Categorie :</span>
        <button
          onClick={() => setCategory('all')}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
            currentCategory === 'all'
              ? 'bg-primary text-white shadow-lg shadow-primary/30'
              : 'bg-foreground/5 text-foreground/70 hover:bg-foreground/10'
          )}
        >
          Tous
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setCategory(category.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              currentCategory === category.id
                ? 'text-white shadow-lg'
                : 'bg-foreground/5 text-foreground/70 hover:bg-foreground/10'
            )}
            style={
              currentCategory === category.id
                ? { backgroundColor: category.color, boxShadow: `0 10px 15px -3px ${category.color}40` }
                : undefined
            }
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-foreground/60 mr-1">Statut :</span>
        {statusFilters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              currentFilter === value
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-foreground/5 text-foreground/70 hover:bg-foreground/10'
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export { normalizeText };
