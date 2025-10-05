import { NextResponse } from 'next/server';
import { lessons, lessonSteps } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  const lesson = lessons.find((l) => l.id === id);

  if (!lesson) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  const steps = lessonSteps.filter((step) => step.lessonId === id);

  return NextResponse.json({ ...lesson, steps });
}