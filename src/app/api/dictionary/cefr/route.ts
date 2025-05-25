import { NextRequest, NextResponse } from 'next/server';
import { getCollection, errorResponse, getPaginationParams, createPaginationMeta } from '../../../../lib/api-server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const level = searchParams.get('level');
    
    // Get pagination parameters
    const { limit, skip } = getPaginationParams(searchParams);

    if (!level) {
      return errorResponse('CEFR level parameter is required', 400);
    }

    // MongoDB collection
    const collection = await getCollection();

    // Find words for the specified CEFR level
    const query = { CEFR: level.toUpperCase() };
    
    // Get total count
    const total = await collection.countDocuments(query);
    
    // Get results
    const words = await collection.find(query)
      .collation({ locale: 'en', strength: 2 }) // Case-insensitive sorting
      .sort({ word: 1 }) // Sort alphabetically
      .skip(skip)
      .limit(limit)
      .toArray();

    if (words.length === 0) {
      return NextResponse.json({
        detail: `No words found for CEFR level ${level}`,
        total: 0,
        words: []
      }, { status: 404 });
    }

    // Create pagination meta data
    const paginationMeta = createPaginationMeta(total, limit, skip);

    return NextResponse.json({
      ...paginationMeta,
      words
    });
  } catch (error) {
    console.error('Error fetching words by CEFR level:', error);
    return errorResponse('An error occurred while fetching words', 500);
  }
}
