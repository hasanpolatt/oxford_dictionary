
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