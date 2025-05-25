'use client';

import React from 'react';
import SearchBar from './SearchBar';
import ExportPdfButton from './ExportPdfButton';
import RowsPerPageSelector from './RowsPerPageSelector';
import { DictionaryItem } from '../types';
import styles from '../styles/App.module.css';

interface SearchControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredData: DictionaryItem[];
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
}

export default function SearchControls({
  searchTerm,
  setSearchTerm,
  filteredData,
  itemsPerPage,
  setItemsPerPage
}: SearchControlsProps) {
  return (
    <div className={styles.searchControls}>
      <div className={styles.leftControls}>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <ExportPdfButton
          data={filteredData} 
          title="Word List"
        />
      </div>
      <RowsPerPageSelector
        itemsPerPage={itemsPerPage}
        setItemsPerPage={(value: number) => {
          setItemsPerPage(value);
        }}
        totalItems={filteredData.length}
      />
    </div>
  );
}