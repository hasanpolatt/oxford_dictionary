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
        {isLoading && (
          <div className="modal-loading">
            <div className="modal-loading-spinner"></div>
            <p>Loading word details...</p>
          </div>
        )}
        
        {error && (
          <div className="modal-error">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}
        
        {!isLoading && !error && data && (
          <div className="word-details">
            <div className="word-header">
              <div className="word-title-container">
                <div className="word-main">
                  <span className="language-indicator">EN</span>
                  <h2 className="word-title">{data.English}</h2>
                </div>
                <div className="word-badges">
                  <span className="word-badge cefr-badge">{data.CEFR}</span>
                  <span className="word-badge type-badge">{data.type}</span>
                </div>
              </div>
              <div className="word-translation-container">
                <span className="language-indicator">TR</span>
                <h3 className="word-translation">{data.Turkish}</h3>
              </div>
            </div>
            
            <div className="word-section">
              <div className="section-title-container">
                <h4 className="section-title">Definition</h4>
                <span className="language-indicator small">EN</span>
              </div>
              <p className="section-content">{data.definition}</p>
            </div>
            
            <div className="word-section">
              <div className="section-title-container">
                <h4 className="section-title">Example</h4>
              </div>
              <div className="example-container">
                <div className="example-with-lang">
                  <span className="language-indicator small">EN</span>
                  <p className="example-text">{data.example.en}</p>
                </div>
                <div className="example-with-lang">
                  <span className="language-indicator small">TR</span>
                  <p className="example-translation">{data.example.tr}</p>
                </div>
              </div>
            </div>
            
            {data.synonyms && data.synonyms.length > 0 && (
              <div className="word-section">
                <div className="section-title-container">
                  <h4 className="section-title">Synonyms</h4>
                </div>
                <div className="synonyms-container">
                  {data.synonyms.map((synonym, index) => (
                    <span key={index} className="synonym-tag">{synonym}</span>
                  ))}
                </div>
              </div>
            )}
            
            {data.notes && (
              <div className="word-section">
                <div className="section-title-container">
                  <h4 className="section-title">Notes</h4>
                </div>
                <p className="section-content">{data.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordDetailModal;

