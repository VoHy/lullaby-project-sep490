import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from '../utils/apiUtils';

export function useDebouncedSearch(items, searchFields = [], delay = 300) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounced search term
  const debouncedSetSearchTerm = useCallback(
    debounce((term) => {
      setDebouncedSearchTerm(term);
    }, delay),
    [delay]
  );

  useEffect(() => {
    debouncedSetSearchTerm(searchTerm);
  }, [searchTerm, debouncedSetSearchTerm]);

  // Memoized filtered results
  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return items;

    const searchLower = debouncedSearchTerm.toLowerCase();
    
    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (!value) return false;
        return value.toString().toLowerCase().includes(searchLower);
      });
    });
  }, [items, debouncedSearchTerm, searchFields]);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    filteredItems,
    handleSearchChange,
    isSearching: searchTerm !== debouncedSearchTerm
  };
} 