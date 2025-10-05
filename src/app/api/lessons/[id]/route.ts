import { NextResponse } from 'next/server';
import { db } from '@/db';
import { lessons, lessonSteps } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    // Fetch the lesson
    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, id),
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Fetch the lesson steps for that lesson
    const steps = await db.query.lessonSteps.findMany({
      where: eq(lessonSteps.lessonId, id),
      orderBy: (lessonSteps, { asc }) => [asc(lessonSteps.id)],
    });

    return NextResponse.json({ ...lesson, steps });

  } catch (error) {
    console.error(`Failed to fetch lesson with id ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 });
  }
}