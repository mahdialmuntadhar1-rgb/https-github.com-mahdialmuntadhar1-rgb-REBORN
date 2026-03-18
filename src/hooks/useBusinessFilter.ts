import { useState, useEffect, useMemo } from 'react';
import { Business, GovernorateId } from '../types';
import { MOCK_BUSINESSES } from '../constants';

interface FilterOptions {
  governorateId: GovernorateId;
  category: string;
  searchQuery: string;
}

export function useBusinessFilter({ governorateId, category, searchQuery }: FilterOptions) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  // Debounced search query would be handled here in a real app
  // For mock, we'll just filter the constant array

  const filteredData = useMemo(() => {
    return MOCK_BUSINESSES.filter(b => {
      const matchesGov = b.governorateId === governorateId;
      const matchesCat = category === 'all' || b.category === category;
      const matchesSearch = searchQuery === '' || 
        b.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.nameAr.includes(searchQuery) ||
        b.nameKu.includes(searchQuery);
      return matchesGov && matchesCat && matchesSearch;
    });
  }, [governorateId, category, searchQuery]);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setBusinesses(filteredData.slice(0, page * PAGE_SIZE));
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [filteredData, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [governorateId, category, searchQuery]);

  const hasMore = businesses.length < filteredData.length;

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  };

  return {
    businesses,
    isLoading,
    loadMore,
    hasMore
  };
}
