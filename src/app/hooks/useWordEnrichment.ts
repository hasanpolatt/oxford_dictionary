'use client';

import { useState, useCallback } from 'react';
import { WordEnrichment } from '../../types/WordDetailModal.types';
import { enrichWord as apiEnrichWord } from '../../lib/api-client';

export function useWordEnrichment() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedWordData, setSelectedWordData] = useState<WordEnrichment | null>(null);
  const [isEnriching, setIsEnriching] = useState<boolean>(false);
  const [enrichmentError, setEnrichmentError] = useState<string | null>(null);

  const enrichWord = useCallback(async (word: string, cefr: string) => {
    setIsEnriching(true);
    setEnrichmentError(null);
    setSelectedWordData(null);
    setIsModalOpen(true);

    try {
      const wordData = await apiEnrichWord(word, cefr);
      setSelectedWordData(wordData);
    } catch (err) {
      console.error("Error enriching word:", err);
      setEnrichmentError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsEnriching(false);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    enrichWord,
    isEnriching,
    selectedWordData,
    enrichmentError,
    isModalOpen,
    closeModal
  };
}