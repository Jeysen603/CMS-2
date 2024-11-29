import { useState, useCallback, useMemo } from 'react';

interface UseSearchOptions<T> {
  items: T[];
  searchFields: (keyof T)[];
  initialQuery?: string;
}

export function useSearch<T>({ items, searchFields, initialQuery = '' }: UseSearchOptions<T>) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query.toLowerCase().trim());
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;

    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchQuery);
        }
        return false;
      })
    );
  }, [items, searchFields, searchQuery]);

  return {
    searchQuery,
    filteredItems,
    handleSearch
  };
}