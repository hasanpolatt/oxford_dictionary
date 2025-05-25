import { NextRequest, NextResponse } from 'next/server';
import { getCollection, errorResponse, getPaginationParams, createPaginationMeta } from '../../../../lib/api-server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const cefr = searchParams.get('cefr');
    const language = searchParams.get('lang') || 'all';
    
    // Get pagination parameters
    const { limit, skip, page } = getPaginationParams(searchParams);

    // If query is empty or less than 2 characters, return all words
    if (query !== '' && (!query || query.trim().length < 2)) {
      return errorResponse('Search query must be at least 2 characters', 400);
    }

    // MongoDB collection
    const collection = await getCollection();

    // Search query
    let searchQuery: any = {};
    
    // If query is not empty, perform search
    if (query && query.trim() !== '') {
      // Search by language
      if (language === 'en') {
        searchQuery.word = { $regex: query, $options: 'i' };
      } else if (language === 'tr') {
        searchQuery['translations.tr.word'] = { $regex: query, $options: 'i' };
      } else {
        // Search by word or translation
        searchQuery.$or = [
          { word: { $regex: query, $options: 'i' } },
          { 'translations.tr.word': { $regex: query, $options: 'i' } },
          { definition: { $regex: query, $options: 'i' } }
        ];
      }
    }
    // If query is empty, searchQuery will be empty and all words will be returned
    
    // Filter by cefr level
    if (cefr) {
      searchQuery.CEFR = cefr.toUpperCase();
    }

    // Get total count
    const total = await collection.countDocuments(searchQuery);
    
    // Get results
    const results = await collection.find(searchQuery)
      .collation({ locale: 'en', strength: 2 }) // Case-insensitive sorting
      .sort({ word: 1 }) // Sort alphabetically
      .skip(skip)
      .limit(limit)
      .toArray();

    // Create pagination meta data
    const paginationMeta = createPaginationMeta(total, limit, skip);

    return NextResponse.json({
      ...paginationMeta,
      results
    });
  } catch (error) {
    console.error('Error searching words:', error);
    return errorResponse('An error occurred while searching words', 500);
  }
}