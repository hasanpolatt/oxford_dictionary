import { NextRequest, NextResponse } from 'next/server';
import { getCollection, errorResponse } from '../../../../lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const word = searchParams.get('term');
    const cefr = searchParams.get('cefr') || '';

    if (!word) {
      return errorResponse('Word term parameter is required', 400);
    }

    // MongoDB collection
    const collection = await getCollection();

    // Search word
    let query: any = { word: word };
    if (cefr) {
      query.CEFR = cefr;
    }

    const wordData = await collection.findOne(query);

    if (!wordData) {
      // If word is not found in the specified CEFR level, search without CEFR
      if (cefr) {
        const wordWithoutCefr = await collection.findOne({ word: word });
        if (wordWithoutCefr) {
          return NextResponse.json(wordWithoutCefr);
        }
      }
      return errorResponse('Word not found', 404);
    }

    // Convert word data to UI-friendly format
    const formattedWordData = {
      ...wordData,
      // Add required fields for the WordDetailModal component
      turkishTranslation: wordData.translations?.tr?.word || '',
      turkishExamples: wordData.translations?.tr?.examples || []
    };

    return NextResponse.json(formattedWordData);
  } catch (error) {
    console.error('Error looking up word:', error);
    return errorResponse('An error occurred while looking up the word', 500);
  }
}
