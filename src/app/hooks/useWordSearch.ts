'use client';

import { useState, useMemo } from 'react';
import { DictionaryItem } from '../../types';
import { useCefrFilter } from './useCefrFilter';

export function useWordSearch(initialData: DictionaryItem[]) {
  const [allData] = useState<DictionaryItem[]>(initialData);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Search term filter
  const searchFilteredData = useMemo(() => {
    if (searchTerm.trim() === '') {
      return allData;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allData.filter(item =>
      (item.english && item.english.toLowerCase().includes(lowerSearchTerm)) ||
      (item.turkish && item.turkish.toLowerCase().includes(lowerSearchTerm))
    );
  }, [searchTerm, allData]);
  
  // CEFR filter and sort
  const { 
    filteredAndSortedItems: filteredData, 
    cefrFilter, 
    handleCefrFilterChange, 
    sortByCefr, 
    toggleSortByCefr 
  } = useCefrFilter(searchFilteredData);

  return {
    filteredData,
    searchTerm,
    setSearchTerm,
    cefrFilter,
    handleCefrFilterChange,
    sortByCefr,
    toggleSortByCefr
  };
}