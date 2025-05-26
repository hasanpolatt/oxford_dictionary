import { DictionaryItem } from '../types';
import { getCollection } from './api-server';

// Data Access Layer
// This layer abstracts database operations and provides a clean API to the application layer

// Fetch all words
export async function getAllWords(): Promise<DictionaryItem[]> {
  try {
    console.log('Getting MongoDB collection...');
    const collection = await getCollection();
    console.log('Collection obtained, fetching data...');
    
    const results = await collection.find({})
      .collation({ locale: 'en', strength: 2 })
      .sort({ word: 1 })
      .limit(5000)
      .toArray();
    
    console.log(`Found ${results.length} words`);
      
    // Convert data to Dictionary Item format
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
