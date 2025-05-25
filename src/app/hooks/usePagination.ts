'use client';

import { useState, useMemo, useEffect } from 'react';
import { DictionaryItem } from '../../types';

export function usePagination(data: DictionaryItem[]) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const { currentItems, totalPages } = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    return { currentItems, totalPages };
  }, [data, currentPage, itemsPerPage]);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSetItemsPerPage = (count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return {
    currentItems,
    currentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage: handleSetItemsPerPage,
    paginate
  };
}