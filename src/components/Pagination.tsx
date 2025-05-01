import React, { useState, FormEvent, ChangeEvent } from 'react';

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
    <div className="pagination">
      <button 
        onClick={() => paginate(currentPage - 1)} 
        disabled={currentPage === 1}
        className="pagination-button"
      >
        Previous
      </button>
      
      <div className="simple-page-selector">
        <div className="current-page-display">
          <span className="current-page">Page {currentPage}</span>
          <span className="page-text">/ {totalPages}</span>
        </div>
        
        <form onSubmit={goToPage} className="page-form">
          <span className="page-text">Go:</span>
          <input 
            type="number" 
            min="1" 
            max={totalPages}
            value={inputPage}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInputPage(e.target.value)}
            className="simple-page-input"
            aria-label="Page number"
          />
          <button 
            type="submit"
            className="go-page-button"
            aria-label="Go to page"
          >
            Go
          </button>
        </form>
      </div>
      
      <button 
        onClick={() => paginate(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
