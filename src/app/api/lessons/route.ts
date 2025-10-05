import { NextResponse } from 'next/server';
import { lessons } from '@/lib/data';

export async function GET() {
  return NextResponse.json(lessons);
}