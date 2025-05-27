'use client';

import { useState, useCallback } from 'react';
import { WordEnrichment } from '../../types/WordDetailModal.types';
import { enrichWord as apiEnrichWord } from '../../lib/api-client';
import { useCache } from '../../lib/cache-service';

export function useWordEnrichment() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedWordData, setSelectedWordData] = useState<WordEnrichment | null>(null);
  const [isEnriching, setIsEnriching] = useState<boolean>(false);
  const [enrichmentError, setEnrichmentError] = useState<string | null>(null);
  
  // Use the cache service with 'words' namespace
  const wordCache = useCache<WordEnrichment>('words');

  const enrichWord = useCallback(async (word: string, cefr: string) => {
    setIsEnriching(true);
    setEnrichmentError(null);
    setSelectedWordData(null);
    setIsModalOpen(true);

    // Create cache key
    const cacheKey = `${word}-${cefr}`;
    
    // Check if data exists in cache
    const cachedData = wordCache.getItem(cacheKey);
    
    if (cachedData) {
      setSelectedWordData(cachedData);
      setIsEnriching(false);
      return;
    }

    try {
      const wordData = await apiEnrichWord(word, cefr);
      // Save to cache service
      wordCache.setItem(cacheKey, wordData);
      setSelectedWordData(wordData);
    } catch (err) {
      console.error("Error enriching word:", err);
      setEnrichmentError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsEnriching(false);
    }
  }, [wordCache]);

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