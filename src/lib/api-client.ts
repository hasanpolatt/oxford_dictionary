import { DictionaryItem } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchInitialWords(): Promise<DictionaryItem[]> {
  try {
    console.log('Fetching words...');
    
    // Relative URL
    const response = await fetch(`${API_BASE_URL}/api/dictionary/search?q=&limit=5000`, {
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    let wordsList: any[] = [];
    if (data.results && Array.isArray(data.results)) {
      wordsList = data.results;
    } else if (data.words && Array.isArray(data.words)) {
      wordsList = data.words;
    } else {
      throw new Error('Unexpected API response format');
    }
    
    return wordsList.map((word: any, index: number) => ({
      number: (index + 1).toString(),
      cefr: word.CEFR || word.cefr || '',
      wordType: word.type || word.wordType || '',
      english: word.word || word.english || '',
      turkish: word.translations?.tr?.word || word.turkish || ''
    }));
    
  } catch (error) {
    console.error('Error fetching initial words:', error);
    throw error;
  }
}

export async function enrichWord(word: string, cefr: string) {
  const encodedWord = encodeURIComponent(word);
  
  const response = await fetch(`/api/dictionary/word?term=${encodedWord}&cefr=${cefr}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
  });

  if (!response.ok) {
    let errorMsg = `API Error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  const responseData = await response.json();
  return responseData.data || responseData;
}