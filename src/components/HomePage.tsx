'use client';

import React from 'react';
import { DictionaryItem } from '../types';
import SearchControls from './SearchControls';
import DictionaryTable from './DictionaryTable';
import Pagination from './Pagination';
import WordDetailModal from './WordDetailModal';
import ScrollToTop from './ScrollToTop';
import { useWordSearch } from '../app/hooks/useWordSearch';
import { useWordEnrichment } from '../app/hooks/useWordEnrichment';
import { usePagination } from '../app/hooks/usePagination';
import styles from '../styles/App.module.css';

interface HomePageProps {
  initialData: DictionaryItem[];
}

export default function HomePage({ initialData }: HomePageProps) {
  const { filteredData, searchTerm, setSearchTerm } = useWordSearch(initialData);
  const { enrichWord, isEnriching, selectedWordData, enrichmentError, isModalOpen, closeModal } = useWordEnrichment();
  const { currentItems, currentPage, totalPages, itemsPerPage, setItemsPerPage, paginate } = usePagination(filteredData);

  const handleEnrichWord = async (item: DictionaryItem) => {
    await enrichWord(item.english, item.cefr);
  };

  return (
    <div className={styles.content}>
      <SearchControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredData={filteredData}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />

      <DictionaryTable 
        data={currentItems} 
        onRowClick={handleEnrichWord} 
      />

      {filteredData.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}

      <WordDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={selectedWordData}
        isLoading={isEnriching}
        error={enrichmentError}
      />
      
      <ScrollToTop />
    </div>
  );
}