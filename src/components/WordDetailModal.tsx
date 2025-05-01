import React from 'react';
import { WordEnrichment } from '../types/WordDetailModal.types';
import '../styles/WordDetailModal.css';

interface WordDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WordEnrichment | null;
  isLoading: boolean;
  error: string | null;
}

const WordDetailModal: React.FC<WordDetailModalProps> = ({
  isOpen,
  onClose,
  data,
  isLoading,
  error,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        
        {isLoading && (
          <div className="modal-loading">
            <p>Loading word details...</p>
          </div>
        )}
        
        {error && (
          <div className="modal-error">
            <p>Error: {error}</p>
          </div>
        )}
        
        {!isLoading && !error && data && (
          <div className="word-details">
            <div className="word-header">
              <h2 className="word-title">{data.English}</h2>
              <span className="word-cefr">{data.CEFR}</span>
              <span className="word-type">{data.type}</span>
            </div>
            
            <div className="word-translation">
              <h3 className="translation-title">Turkish</h3>
              <p className="translation-text">{data.Turkish}</p>
            </div>
            
            <div className="word-definition">
              <h3 className="definition-title">Definition</h3>
              <p className="definition-text">{data.definition}</p>
            </div>
            
            {data.example && (
              <div className="word-examples">
                <h3 className="examples-title">Example</h3>
                <div className="example-item">
                  <p className="example-en">{data.example.en}</p>
                  <p className="example-tr">{data.example.tr}</p>
                </div>
              </div>
            )}
            
            {data.synonyms && data.synonyms.length > 0 && (
              <div className="word-synonyms">
                <h3 className="synonyms-title">Synonyms</h3>
                <div className="synonyms-list">
                  {data.synonyms.map((synonym, index) => (
                    <span key={index} className="synonym-item">
                      {synonym}{index < data.synonyms.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {data.notes && (
              <div className="word-notes">
                <h3 className="notes-title">Notes</h3>
                <p className="notes-text">{data.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordDetailModal;

