import React from 'react';
import styles from './RowsPerPageSelector.module.css';

interface RowsPerPageSelectorProps {
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  totalItems?: number;
}

const RowsPerPageSelector: React.FC<RowsPerPageSelectorProps> = ({ 
  itemsPerPage, 
  setItemsPerPage,
  totalItems = 0
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'all') {
      setItemsPerPage(totalItems || 5000);
    } else {
      const value = parseInt(e.target.value, 10);
      setItemsPerPage(value);
    }
  };

  return (
    <div className={styles.rowsPerPageSelector}>
      <label htmlFor="itemsPerPage">List: </label>
      <select 
        id="itemsPerPage" 
        value={itemsPerPage === totalItems || itemsPerPage >= 5000 ? 'all' : itemsPerPage} 
        onChange={handleChange}
        className={styles.rowsPerPageSelect}
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value='all'>All</option>
      </select>
    </div>
  );
};

export default RowsPerPageSelector;