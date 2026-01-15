'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export type FilterStatus = 'all' | 'completed' | 'incomplete';
export type SortOrder = 'default' | 'name' | 'category';

export function useAchievementFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = useMemo(
    () => ({
      status: (searchParams.get('filter') as FilterStatus) || 'all',
      sort: (searchParams.get('sort') as SortOrder) || 'default',
      search: searchParams.get('search') || '',
    }),
    [searchParams]
  );

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value && value !== 'all' && value !== 'default') {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  return {
    ...filters,
    setFilter,
    clearFilters,
    hasActiveFilters: filters.status !== 'all' || filters.sort !== 'default' || !!filters.search,
  };
}
