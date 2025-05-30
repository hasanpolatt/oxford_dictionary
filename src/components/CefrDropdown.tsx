import React, { useCallback, useRef, useEffect, useState } from 'react';
import { CefrFilterType } from '../app/hooks/useCefrFilter';
import styles from './CefrDropdown.module.css';
import { FaFilter } from 'react-icons/fa';

interface CefrDropdownProps {
  currentFilter: CefrFilterType;
  isSorted: boolean;
  onFilterChange: (filter: CefrFilterType) => void;
  onSortToggle: () => void;
}

const CefrDropdown: React.FC<CefrDropdownProps> = ({
  currentFilter,
  isSorted,
  onFilterChange
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Toggle dropdown
  const toggleDropdown = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsOpen(prev => !prev);
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // CEFR filter change handler
  const handleFilterSelect = useCallback((filter: CefrFilterType) => {
    onFilterChange(filter);
    setIsOpen(false);
  }, [onFilterChange]);

  return (
    <div className={styles.cefrDropdownContainer}>
      <div onClick={toggleDropdown} className={styles.filterButton}>
        {currentFilter !== 'all' && <span className={styles.activeFilter}>{currentFilter}</span>}
        <FaFilter />
      </div>
      
      {isOpen && (
        <div ref={dropdownRef} className={styles.dropdown}>
          <div className={styles.dropdownItem} onClick={() => handleFilterSelect('all')}>
            <span className={currentFilter === 'all' ? styles.activeItem : ''}>All Levels</span>
          </div>
          <div className={styles.dropdownItem} onClick={() => handleFilterSelect('A1')}>
            <span className={currentFilter === 'A1' ? styles.activeItem : ''}>A1</span>
          </div>
          <div className={styles.dropdownItem} onClick={() => handleFilterSelect('A2')}>
            <span className={currentFilter === 'A2' ? styles.activeItem : ''}>A2</span>
          </div>
          <div className={styles.dropdownItem} onClick={() => handleFilterSelect('B1')}>
            <span className={currentFilter === 'B1' ? styles.activeItem : ''}>B1</span>
          </div>
          <div className={styles.dropdownItem} onClick={() => handleFilterSelect('B2')}>
            <span className={currentFilter === 'B2' ? styles.activeItem : ''}>B2</span>
          </div>
          <div className={styles.dropdownItem} onClick={() => handleFilterSelect('C1')}>
            <span className={currentFilter === 'C1' ? styles.activeItem : ''}>C1</span>
          </div>
          <div className={styles.dropdownItem} onClick={() => handleFilterSelect('C2')}>
            <span className={currentFilter === 'C2' ? styles.activeItem : ''}>C2</span>
          </div>

        </div>
      )}
    </div>
  );
};

export default CefrDropdown;
