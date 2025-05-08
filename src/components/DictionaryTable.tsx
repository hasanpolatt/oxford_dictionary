import React from 'react';
import { DictionaryItem } from '../types';
import '../styles/DictionaryTable.css';

interface DictionaryTableProps {
  data: DictionaryItem[];
  onRowClick: (item: DictionaryItem) => void; 
}

const DictionaryTable: React.FC<DictionaryTableProps> = ({ data, onRowClick }) => {
  const speakWord = (word: string): void => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Maalesef tarayıcınız konuşma sentezini desteklemiyor.');
    }
  };
  
  const handlePronunciationClick = (e: React.MouseEvent, word: string) => {
    e.stopPropagation(); 
    speakWord(word);
  };

  return (
    <div className="table-container">
      <table id="dictionaryTable">
        <thead>
          <tr>
            <th style={{ width: '5%', textAlign: 'center' }}>No</th>
            <th className="cefr-level">CEFR</th>
            <th className="word-type">Type</th>
            <th style={{ textAlign: 'left', paddingLeft: '50px' }}>English</th>
            <th style={{ textAlign: 'left', paddingLeft: '20px' }}>Türkçe</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item.number} 
                onClick={() => onRowClick(item)} 
                className="clickable-row" 
                title="Click for details"
              >
                <td>{item.number}</td>
                <td className="cefr-level">{item.cefr}</td>
                <td className="word-type" title={item.wordType}>
                  {item.wordType && item.wordType.length > 10
                    ? item.wordType.split(',').map(type => type.trim().substring(0, 3)).join(', ')
                    : item.wordType}
                </td>
                <td>
                  <div className="english-word-container">
                    <button
                      className="pronunciation-button"
                      onClick={(e) => handlePronunciationClick(e, item.english)} 
                      title="Telaffuz et"
                      aria-label={`${item.english} kelimesini telaffuz et`}
                    >
                      <svg xmlns="" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                      </svg>
                    </button>
                    <span className="english-word">{item.english}</span>
                  </div>
                </td>
                <td>{item.turkish}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="no-results">No results found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DictionaryTable;