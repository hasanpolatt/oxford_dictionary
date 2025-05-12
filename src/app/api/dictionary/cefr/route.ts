import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const level = searchParams.get('level');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    if (!level) {
      return NextResponse.json({ detail: 'CEFR level parameter is required' }, { status: 400 });
    }

    // MongoDB connection
    const client = await clientPromise;
    const db = client.db('oxford_dictionary');
    const collection = db.collection('words');

    // Find words for the specified CEFR level
    const query = { CEFR: level.toUpperCase() };
    
    // Get total count
    const total = await collection.countDocuments(query);
    
    // Get results
    const words = await collection.find(query)
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

    return NextResponse.json({
      total,
      words,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching words by CEFR level:', error);
    return NextResponse.json(
      { detail: 'An error occurred while fetching words' },
      { status: 500 }
    );
  }
}
