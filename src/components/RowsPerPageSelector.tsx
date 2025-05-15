import React from 'react';
import styles from './RowsPerPageSelector.module.css';

interface RowsPerPageSelectorProps {
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
}

const RowsPerPageSelector: React.FC<RowsPerPageSelectorProps> = ({ 
  itemsPerPage, 
  setItemsPerPage 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setItemsPerPage(value);
  };

  return (
    <div className={styles.rowsPerPageSelector}>
      <label htmlFor="itemsPerPage">List: </label>
      <select 
        id="itemsPerPage" 
        value={itemsPerPage} 
        onChange={handleChange}
        className={styles.rowsPerPageSelect}
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
};

export default RowsPerPageSelector;