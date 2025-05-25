'use client';

import { useState, useEffect, useMemo } from 'react';
import { DictionaryItem } from '../../types';

export function useWordSearch(initialData: DictionaryItem[]) {
  const [allData] = useState<DictionaryItem[]>(initialData);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredData = useMemo(() => {
    if (searchTerm.trim() === '') {
      return allData;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allData.filter(item =>
      (item.english && item.english.toLowerCase().includes(lowerSearchTerm)) ||
      (item.turkish && item.turkish.toLowerCase().includes(lowerSearchTerm))
    );
  }, [searchTerm, allData]);

  return {
    filteredData,
    searchTerm,
    setSearchTerm
  };
}