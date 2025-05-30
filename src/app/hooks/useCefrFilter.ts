'use client';

import { useState, useMemo } from 'react';
import { DictionaryItem } from '../../types';

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// CEFR filtering levels
export type CefrFilterType = 'all' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// CEFR filtering and sorting operations manager
export function useCefrFilter(items: DictionaryItem[]) {
  const [cefrFilter, setCefrFilter] = useState<CefrFilterType>('all');
  const [sortByCefr, setSortByCefr] = useState<boolean>(false);

  // CEFR filter change handler
  const handleCefrFilterChange = (cefr: CefrFilterType) => {
    setCefrFilter(cefr);
  };

  // CEFR sort toggle handler
  const toggleSortByCefr = () => {
    setSortByCefr(prev => !prev);
  };

  // CEFR filter and sort
  const filteredAndSortedItems = useMemo(() => {
    // Copy the original array
    let result = [...items];
    
    // CEFR filtering
    if (cefrFilter !== 'all') {
      result = result.filter(item => item.cefr === cefrFilter);
    }
    
    // CEFR sorting
    if (sortByCefr) {
      result.sort((a, b) => {
        const cefrOrder: Record<string, number> = {
          'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6
        };
        return cefrOrder[a.cefr] - cefrOrder[b.cefr];
      });
    }
    
    return result;
  }, [items, cefrFilter, sortByCefr]);

  return {
    filteredAndSortedItems,
    cefrFilter,
    handleCefrFilterChange,
    sortByCefr,
    toggleSortByCefr
  };
}
