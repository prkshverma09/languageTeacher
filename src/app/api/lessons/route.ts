import { NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET() {
  try {
    const allLessons = await db.query.lessons.findMany();
    return NextResponse.json(allLessons);
  } catch (error) {
    console.error("Failed to fetch lessons:", error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}