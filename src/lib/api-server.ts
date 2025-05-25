import { NextResponse } from 'next/server';
import clientPromise from './mongodb';

// MongoDB connection
export async function getCollection(collectionName: string = 'words3000') {
  try {
    const client = await clientPromise;
    const db = client.db('oxword-dictionary');
    return db.collection(collectionName);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Error response helper function
export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json(
    { detail: message },
    { status }
  );
}

// Pagination helper function
export function getPaginationParams(params: URLSearchParams) {
  const limit = parseInt(params.get('limit') || '20', 10);
  const skip = parseInt(params.get('skip') || '0', 10);
  const page = Math.floor(skip / limit) + 1;
  
  return { limit, skip, page };
}

// Pagination meta data creator function
export function createPaginationMeta(total: number, limit: number, skip: number) {
  return {
    total,
    page: Math.floor(skip / limit) + 1,
    totalPages: Math.ceil(total / limit)
  };
}