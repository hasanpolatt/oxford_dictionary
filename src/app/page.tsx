'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DictionaryTable from '../components/DictionaryTable';
import ExportPdfButton from '../components/ExportPdfButton';
import SearchBar from '../components/SearchBar';
import RowsPerPageSelector from '../components/RowsPerPageSelector';
import Pagination from '../components/Pagination';
import { DictionaryItem } from '../types';
import { WordEnrichment } from '../types/WordDetailModal.types';
import WordDetailModal from '../components/WordDetailModal';
import ScrollToTop from '../components/ScrollToTop';
import styles from '../styles/App.module.css';

export default function HomePage() {
  const [allData, setAllData] = useState<DictionaryItem[]>([]);
  const [filteredData, setFilteredData] = useState<DictionaryItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedWordData, setSelectedWordData] = useState<WordEnrichment | null>(null);
  const [isEnriching, setIsEnriching] = useState<boolean>(false);
  const [enrichmentError, setEnrichmentError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    const fetchWordsFromMongoDB = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch words from MongoDB
        const response = await fetch(`/api/dictionary/search?q=&limit=5000`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API response:', data); // Debug for API response
        
        // API response format control
        let wordsList: any[] = [];
        
        if (data.results && Array.isArray(data.results)) {
          wordsList = data.results;
        } else if (data.words && Array.isArray(data.words)) {
          wordsList = data.words;
        } else {
          console.error('Unexpected API response format:', data);
          throw new Error('API response format is unexpected. Check the console.');
        }
        
        // Convert MongoDB data to DictionaryItem format
        const formattedData: DictionaryItem[] = wordsList.map((word: any, index: number) => {
          // Check and convert data structure for each word
          return {
            number: (index + 1).toString(),
            cefr: word.CEFR || word.cefr || '',
            wordType: word.type || word.wordType || '',
            english: word.word || word.english || '',
            turkish: word.translations?.tr?.word || word.turkish || ''
          };
        });
        
        console.log('Formatted data sample:', formattedData.slice(0, 3)); // Log the first 3 words
        
        if (formattedData.length === 0) {
          console.warn('No words found in the database');
          setError('No words found in the database.');
        } else {
          setAllData(formattedData);
          setFilteredData(formattedData);
          setError(null);
        }
        
        setIsLoading(false);
      } catch (fetchError: any) {
        console.error('Error loading words from MongoDB:', fetchError);
        setError(`Error loading words from MongoDB: ${fetchError.message}`);
        setIsLoading(false);
      }
    };

    fetchWordsFromMongoDB();
  }, [API_BASE_URL, error]); 

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(allData);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = allData.filter(item =>
        (item.english && item.english.toLowerCase().includes(lowerSearchTerm)) ||
        (item.turkish && item.turkish.toLowerCase().includes(lowerSearchTerm))
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, allData]);

  const handleEnrichWord = useCallback(async (item: DictionaryItem) => {
    if (!API_BASE_URL) {
      console.error("API URL is not configured.");
      setEnrichmentError("API URL is not configured.");
      setIsModalOpen(true); 
      return;
    }

    setIsEnriching(true);
    setEnrichmentError(null);
    setSelectedWordData(null); 
    setIsModalOpen(true);

    // Encode the word to handle special characters in URLs
    const encodedWord = encodeURIComponent(item.english);
    
    try {
      // Use dictionary/word endpoint
      const response = await fetch(`/api/dictionary/word?term=${encodedWord}&cefr=${item.cefr}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
         let errorMsg = `API Error: ${response.status}`;
         try {
           const errorData = await response.json();
           errorMsg = errorData.detail || errorMsg; 
         } catch (jsonError) {
            
         }
         throw new Error(errorMsg);
      }

      const responseData = await response.json();
      
      // API response can be direct data or in { message, data } format
      const wordData = responseData.data || responseData;
      setSelectedWordData(wordData);

    } catch (err) {
       console.error("Error enriching word:", err);
       setEnrichmentError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsEnriching(false);
    }
  }, [API_BASE_URL]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

  return (
    <div className={styles.content}>
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
            setCurrentPage(1);
          }}
          totalItems={filteredData.length}
        />
      </div>

      {isLoading ? (
        <div className={styles.loading}></div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          <DictionaryTable data={currentItems} onRowClick={handleEnrichWord} />

          {filteredData.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            />
          )}
        </>
      )}

      {/* Render Modal */}
      <WordDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        data={selectedWordData}
        isLoading={isEnriching}
        error={enrichmentError}
      />
      
      {/* Scroll To Top Button */}
      <ScrollToTop />
    </div>
  );
}
