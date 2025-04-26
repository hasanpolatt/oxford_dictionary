import React, { useState, useEffect } from 'react';
import DictionaryTable from '../components/DictionaryTable';
import ExportPdfButton from '../components/ExportPdfButton';
import SearchBar from '../components/SearchBar';
import RowsPerPageSelector from '../components/RowsPerPageSelector';
import { DictionaryItem } from '../types';

const HomePage: React.FC = () => {
  const [allData, setAllData] = useState<DictionaryItem[]>([]);
  const [filteredData, setFilteredData] = useState<DictionaryItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  // Function to parse CSV file
  const parseCSV = (csv: string): DictionaryItem[] => {
    const lines = csv.split('\n');
    const result: DictionaryItem[] = [];
    
    // Process each row
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      if (i === 0) {
        continue; // Skip header row in table data
      } else {
        try {
          // Separate by semicolon
          const columns = lines[i].split(';');
          
          if (columns.length >= 5) {
            const number = columns[0].trim();
            const cefr = columns[1].trim();
            const wordType = columns[2].trim();
            const english = columns[3].trim();
            const turkish = columns[4].trim();
            
            result.push({
              number: number,
              cefr: cefr,
              wordType: wordType,
              english: english,
              turkish: turkish
            });
          }
        } catch (error) {
          console.error(`Error parsing line ${i}: ${lines[i]}`, error);
          // Continue to next line even if there is an error
        }
      }
    }
    
    return result;
  };

  // Fetch CSV data when component loads
  useEffect(() => {
    const fetchCSVData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await fetch('/words.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();
        const parsedData = parseCSV(data);
        setAllData(parsedData);
        setFilteredData(parsedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading CSV file:', error);
        setError('An error occurred while loading the CSV file. Please check that the file is in the correct location.');
        setIsLoading(false);
      }
    };

    fetchCSVData();
  }, []);

  // Search process
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(allData);
    } else {
      const filtered = allData.filter(item => 
        (item.english && item.english.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (item.turkish && item.turkish.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1); // Return to the first page when searching
  }, [searchTerm, allData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

  return (
    <div className="content">
      <div className="search-controls">
        <div className="left-controls">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <ExportPdfButton 
            data={filteredData}
            title="Oxford Dictionary"
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
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <DictionaryTable data={currentItems} />
          
          {filteredData.length > 0 && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                &laquo; Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;