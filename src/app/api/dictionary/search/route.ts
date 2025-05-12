import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const cefr = searchParams.get('cefr');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const language = searchParams.get('lang') || 'all'; // 'en', 'tr', 'all'

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ detail: 'Search query must be at least 2 characters' }, { status: 400 });
    }

    // MongoDB connection
    const client = await clientPromise;
    const db = client.db('oxford_dictionary');
    const collection = db.collection('words');

    // Search query
    let searchQuery: any = {};
    
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
    
    // Filter by cefr level
    if (cefr) {
      searchQuery.CEFR = cefr.toUpperCase();
    }

    // Get total count
    const total = await collection.countDocuments(searchQuery);
    
    // Get results
    const results = await collection.find(searchQuery)
      .sort({ word: 1 }) // Sort alphabetically
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      total,
      results,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error searching words:', error);
    return NextResponse.json(
      { detail: 'An error occurred while searching words' },
      { status: 500 }
    );
  }
}
