import { DictionaryItem } from '../types';
import { getCollection } from './api-server';

/**
 * Veri erişim katmanı (Data Access Layer)
 * Bu katman, veritabanı işlemlerini soyutlar ve uygulama katmanına temiz bir API sunar
 */

/**
 * Tüm kelimeleri getirir ve DictionaryItem formatına dönüştürür
 */
export async function getAllWords(): Promise<DictionaryItem[]> {
  try {
    const collection = await getCollection();
    const results = await collection.find({})
      .collation({ locale: 'en', strength: 2 })
      .sort({ word: 1 })
      .limit(5000)
      .toArray();
      
    // Verileri DictionaryItem formatına dönüştür
    return results.map((word, index) => ({
      number: (index + 1).toString(),
      cefr: word.CEFR || word.cefr || '',
      wordType: word.type || word.wordType || '',
      english: word.word || word.english || '',
      turkish: word.translations?.tr?.word || word.turkish || ''
    }));
  } catch (error) {
    console.error('Error fetching all words:', error);
    throw new Error('Failed to fetch dictionary data');
  }
}
