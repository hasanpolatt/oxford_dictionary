import React from 'react';
import { WordEnrichment } from '../types/WordDetailModal.types';
import styles from '../components/WordDetailModal.module.css';

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
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        {isLoading && (
          <div className={styles.modalLoading}>
            <div className={styles.modalLoadingSpinner}></div>
            <p>Loading word details...</p>
          </div>
        )}
        
        {error && (
          <div className={styles.modalError}>
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}
        
        {!isLoading && !error && data && (
          <div className={styles.wordDetails}>
            <div className={styles.wordHeader}>
              <div className={styles.wordTitleContainer}>
                <div className={styles.wordMain}>
                  <span className={styles.languageIndicator}>EN</span>
                  <h2 className={styles.wordTitle}>{data.word}</h2>
                </div>
                <div className={styles.wordBadges}>
                  <span className={styles.cefrBadge}>{data.CEFR}</span>
                  <span className={styles.typeBadge}>{data.type}</span>
                </div>
              </div>
              <div className={styles.wordTranslationContainer}>
                <span className={styles.languageIndicator}>TR</span>
                <h3 className={styles.wordTranslation}>{data.translations?.tr?.word || ''}</h3>
              </div>
            </div>
            
            <div className={styles.wordSection}>
              <div className={styles.sectionTitleContainer}>
                <h4 className={styles.sectionTitle}>Definition</h4>
                <span className={styles.languageIndicatorSmall}>EN</span>
              </div>
              <p className={styles.sectionContent}>{data.definition}</p>
            </div>
            
            {data.examples && data.examples.length > 0 && (
              <div className={styles.wordSection}>
                <div className={styles.sectionTitleContainer}>
                  <h4 className={styles.sectionTitle}>Example</h4>
                </div>
                <div className={styles.exampleContainer}>
                  <div className={styles.exampleWithLang}>
                    <span className={styles.languageIndicatorSmall}>EN</span>
                    <p className={styles.exampleText}>{data.examples[0]}</p>
                  </div>
                  {data.translations?.tr?.examples && data.translations.tr.examples.length > 0 && (
                    <div className={styles.exampleWithLang}>
                      <span className={styles.languageIndicatorSmall}>TR</span>
                      <p className={styles.exampleTranslation}>{data.translations.tr.examples[0]}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {data.synonyms && data.synonyms.length > 0 && (
              <div className={styles.wordSection}>
                <div className={styles.sectionTitleContainer}>
                  <h4 className={styles.sectionTitle}>Synonyms</h4>
                </div>
                <div className={styles.synonymsContainer}>
                  {data.synonyms.map((synonym, index) => (
                    <span key={index} className={styles.synonymTag}>{synonym}</span>
                  ))}
                </div>
              </div>
            )}
            
            {data.note && (
              <div className={styles.wordSection}>
                <div className={styles.sectionTitleContainer}>
                  <h4 className={styles.sectionTitle}>Notes</h4>
                </div>
                <p className={styles.sectionContent}>{data.note}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordDetailModal;

