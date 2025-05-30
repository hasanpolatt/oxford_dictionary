import React from 'react';
import { DictionaryItem } from '../types';
import styles from '../components/DictionaryTable.module.css';
import { enrichWord } from '../lib/api-client';
import { useCache } from '../lib/cache-service';
import { WordEnrichment } from '../types/WordDetailModal.types';
import { CefrFilterType } from '../app/hooks/useCefrFilter';
import CefrDropdown from './CefrDropdown';
import { FaVolumeUp } from 'react-icons/fa';

interface DictionaryTableProps {
  data: DictionaryItem[];
  onRowClick: (item: DictionaryItem) => void;
  onCefrFilterChange?: (cefr: CefrFilterType) => void;
  onCefrSortToggle?: () => void;
  currentCefrFilter?: CefrFilterType;
  isSortedByCefr?: boolean;
}

const DictionaryTable: React.FC<DictionaryTableProps> = ({ 
  data, 
  onRowClick, 
  onCefrFilterChange = () => {}, 
  onCefrSortToggle = () => {}, 
  currentCefrFilter = 'all', 
  isSortedByCefr = false 
}) => {
  // Use the cache service with 'words' namespace
  const wordCache = useCache<WordEnrichment>('words');
  
  // Prefetch word data on hover
  const prefetchWordData = (item: DictionaryItem) => {
    // Create cache key
    const cacheKey = `${item.english}-${item.cefr}`;
    
    // Only fetch if not already in cache
    if (!wordCache.getItem(cacheKey)) {
      // Fetch in background without waiting for result
      enrichWord(item.english, item.cefr)
        .then(wordData => {
          // Save to cache service
          wordCache.setItem(cacheKey, wordData);
        })
        .catch(() => {
          // Silently continue on error, will retry when user clicks
        });
    }
  };
  const getTypeClass = (type: string): string => {
    const typeMap: {[key: string]: string} = {
      'adj.': 'adj',
      'adj': 'adj',
      'n.': 'n',
      'noun': 'n',
      'v.': 'v',
      'verb': 'v',
      'adv.': 'adv',
      'adverb': 'adv',
      'prep.': 'prep',
      'preposition': 'prep',
      'conj.': 'conj',
      'conjunction': 'conj',
      'pron.': 'pron',
      'pronoun': 'pron',
      'interj.': 'interj',
      'interjection': 'interj',
      'article': 'art',
      'indefinite article': 'art',
      'definite article': 'art'
    };
    
    const normalizedType = type.toLowerCase().replace(/\./g, '').trim();
    
    for (const [key, value] of Object.entries(typeMap)) {
      if (normalizedType.includes(key.replace(/\./g, ''))) {
        return value;
      }
    }
    
    return 'v';
  };
  
  const speakWord = (word: string): void => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Unfortunately, your browser does not support speech synthesis.');
    }
  };
  
  const handlePronunciationClick = (e: React.MouseEvent, word: string) => {
    e.stopPropagation(); 
    speakWord(word);
  };

  return (
    <div className={styles.tableContainer}>
      <table id="dictionaryTable" className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th} style={{ width: '5%', textAlign: 'center' }}>No</th>
            <th 
              className={`${styles.th} ${styles.cefrLevel} ${isSortedByCefr ? styles.sorted : ''}`}
              onClick={onCefrSortToggle}
            >
              <div className={styles.cefrHeaderContainer}>
                <span className={styles.cefrHeaderText}>CEFR</span>
                <span className={styles.cefrFilterIcon} onClick={(e) => {
                  e.stopPropagation(); // Block title click event
                }}>
                  <CefrDropdown 
                    currentFilter={currentCefrFilter} 
                    isSorted={isSortedByCefr}
                    onFilterChange={onCefrFilterChange}
                    onSortToggle={onCefrSortToggle}
                  />
                </span>
              </div>
            </th>
            <th className={`${styles.th} ${styles.wordType}`}>Type</th>
            <th className={`${styles.th} ${styles.thEnglish}`}>English</th>
            <th className={`${styles.th} ${styles.thTurkish}`}>Türkçe</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => {
              // Creating consecutive ID
              const displayId = index + 1;
              
              return (
                <tr
                  key={item.number} 
                  onClick={() => onRowClick(item)}
                  onMouseEnter={() => prefetchWordData(item)}
                  className={`${styles.tr} ${styles.clickableRow}`} 
                  title="Click for details"
                >
                  <td className={`${styles.td} ${styles.tdNumber}`}>{displayId}</td>
                  <td className={`${styles.td} ${styles.cefrLevel}`}>{item.cefr}</td>
                  <td className={`${styles.td} ${styles.wordType}`} title={item.wordType}>
                    {item.wordType && (
                      <>
                        {item.wordType.length > 10 ? (
                          // If multiple word types are present
                          <div>
                            {item.wordType.split(',').map((type, index) => {
                              const typeClass = getTypeClass(type.trim());
                              return (
                                <span key={index} className={styles[typeClass]}>
                                  {type.trim().substring(0, 3)}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          // If only one word type is present
                          <span className={styles[getTypeClass(item.wordType)]}>
                            {item.wordType}
                          </span>
                        )}
                      </>
                    )}
                  </td>
                  <td className={`${styles.td} ${styles.tdEnglish}`}>
                    <div className={styles.englishWordContainer}>
                      <button
                        className={styles.pronunciationButton}
                        onClick={(e) => handlePronunciationClick(e, item.english)} 
                        title="Pronounce"
                        aria-label={`${item.english} word pronunciation`}
                      >
                        <FaVolumeUp />
                      </button>
                      <span className={styles.englishWord}>{item.english}</span>
                    </div>
                  </td>
                  <td className={`${styles.td} ${styles.tdTurkish}`}>{item.turkish}</td>
                </tr>
              );
            })
          ) : (
            <tr className={styles.tr}>
              <td colSpan={5} className={`${styles.td} ${styles.noResults}`}>No results found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DictionaryTable;