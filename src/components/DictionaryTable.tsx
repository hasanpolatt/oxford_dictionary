import React from 'react';
import { DictionaryItem } from '../types';
import styles from '../components/DictionaryTable.module.css';

interface DictionaryTableProps {
  data: DictionaryItem[];
  onRowClick: (item: DictionaryItem) => void; 
}

const DictionaryTable: React.FC<DictionaryTableProps> = ({ data, onRowClick }) => {
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
            <th className={`${styles.th} ${styles.cefrLevel}`}>CEFR</th>
            <th className={`${styles.th} ${styles.wordType}`}>Type</th>
            <th className={`${styles.th} ${styles.thEnglish}`}>English</th>
            <th className={`${styles.th} ${styles.thTurkish}`}>Türkçe</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item.number} 
                onClick={() => onRowClick(item)} 
                className={`${styles.tr} ${styles.clickableRow}`} 
                title="Click for details"
              >
                <td className={`${styles.td} ${styles.tdNumber}`}>{item.number}</td>
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
                      <svg xmlns="" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                      </svg>
                    </button>
                    <span className={styles.englishWord}>{item.english}</span>
                  </div>
                </td>
                <td className={`${styles.td} ${styles.tdTurkish}`}>{item.turkish}</td>
              </tr>
            ))
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