import React, { useState, useEffect, useCallback } from 'react';
import DictionaryTable from '../components/DictionaryTable';
import ExportPdfButton from '../components/ExportPdfButton';
import SearchBar from '../components/SearchBar';
import RowsPerPageSelector from '../components/RowsPerPageSelector';
import Pagination from '../components/Pagination';
import { DictionaryItem } from '../types';
import { WordDetailsInput, WordDetailsResponse, WordEnrichment } from '../types/WordDetailModal.types';
import WordDetailModal from '../components/WordDetailModal';
import styles from '../styles/App.module.css';

const HomePage: React.FC = () => {
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

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
  const WORD_CSV = process.env.REACT_APP_WORD_CSV || '';

  const parseCSV = (csv: string): DictionaryItem[] => {
    const lines = csv.split('\n');
    const result: DictionaryItem[] = [];
    const headers = lines[0].split(';').map(h => h.trim().toLowerCase()); 

    const numberIndex = headers.indexOf('number');
    const cefrIndex = headers.indexOf('cefr');
    const typeIndex = headers.indexOf('type'); 
    const englishIndex = headers.indexOf('english');
    const turkishIndex = headers.indexOf('turkish'); 

    if ([numberIndex, cefrIndex, typeIndex, englishIndex, turkishIndex].includes(-1)) {
       console.error("CSV header is missing one or more required columns: number, cefr, type, english, turkish");
       setError("CSV file has incorrect headers. Required: number;cefr;type;english;turkish");
       return []; 
    }

    for (let i = 1; i < lines.length; i++) { 
      if (!lines[i].trim()) continue;

      try {
        const columns = lines[i].split(';');
        if (columns.length >= 5) { 
          const number = columns[numberIndex]?.trim() || '';
          const cefr = columns[cefrIndex]?.trim() || '';
          const wordType = columns[typeIndex]?.trim() || ''; 
          const english = columns[englishIndex]?.trim() || '';
          const turkish = columns[turkishIndex]?.trim() || ''; 

          if (english && turkish) { 
             result.push({ number, cefr, wordType, english, turkish });
          }
        }
      } catch (parseError) {
        console.error(`Error parsing line ${i}: ${lines[i]}`, parseError);
      }
    }
    return result;
  };


  useEffect(() => {
    const fetchCSVData = async (): Promise<void> => {
      if (!API_BASE_URL) {
        setError("API URL is not configured. Please set REACT_APP_API_BASE_URL in your environment.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null); 
        const response = await fetch(`/${WORD_CSV}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();
        const parsedData = parseCSV(data);
        if (error) { 
            setIsLoading(false);
            return; 
        }
        setAllData(parsedData);
        setFilteredData(parsedData);
        setIsLoading(false);
      } catch (fetchError) {
        console.error('Error loading CSV file:', fetchError);
        setError('An error occurred while loading the word list (CSV). Please check console.');
        setIsLoading(false);
      }
    };

    fetchCSVData();
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
      // Use the lookup endpoint instead of the detail endpoint
      const response = await fetch(`${API_BASE_URL}/words/lookup/${encodedWord}?cefr=${item.cefr}`, {
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
    </div>
  );
};

export default HomePage;