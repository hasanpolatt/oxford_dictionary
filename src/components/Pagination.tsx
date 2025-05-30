import React, { useState, FormEvent, ChangeEvent } from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, paginate }) => {
  const [inputPage, setInputPage] = useState<string | number>(currentPage);
  
  // Go to selected page
  const goToPage = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    // Valid page number check
    let pageNum = parseInt(inputPage.toString(), 10);
    
    if (isNaN(pageNum) || pageNum < 1) {
      pageNum = 1;
    } else if (pageNum > totalPages) {
      pageNum = totalPages;
    }
    
    paginate(pageNum);
  };
  
  return (
    <div className={styles.pagination}>
      <button 
        onClick={() => paginate(currentPage - 1)} 
        disabled={currentPage === 1}
        className={styles.paginationButton}
      >
        Previous
      </button>
      
      <div className={styles.pageContainer}>
        <span className={styles.currentPage}>Page {currentPage}</span>
        <span className={styles.pageText}>/ {totalPages}</span>
        
        <form onSubmit={goToPage} className={styles.pageForm}>
          <span className={styles.pageText}>Go:</span>
          <input 
            type="number" 
            min="1" 
            max={totalPages}
            value={inputPage}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInputPage(e.target.value)}
            className={styles.simplePageInput}
            aria-label="Page number"
          />
          <button 
            type="submit"
            className={styles.goPageButton}
            aria-label="Go to page"
          >
            Go
          </button>
        </form>
      </div>
      
      <button 
        onClick={() => paginate(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className={styles.paginationButton}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
