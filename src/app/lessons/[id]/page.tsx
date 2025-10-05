import { db } from '@/db';
import { lessons, lessonSteps } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import LessonClient from '@/components/LessonClient';

type LessonStep = {
  id: number;
  agentPromptB: string;
  targetPhraseA: string;
};

type Lesson = {
  id: number;
  title: string;
  description: string;
  steps: LessonStep[];
};

async function getLesson(id: string): Promise<Lesson | null> {
  try {
    const lessonId = parseInt(id, 10);

    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
    });

    if (!lesson) {
      return null;
    }

    const steps = await db.query.lessonSteps.findMany({
      where: eq(lessonSteps.lessonId, lessonId),
      orderBy: (lessonSteps, { asc }) => [asc(lessonSteps.id)],
    });

    return { ...lesson, steps };
  } catch (error) {
    console.error("Failed to fetch lesson:", error);
    return null;
  }
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = await getLesson(id);

  if (!lesson) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">Lesson not found</h1>
        <p className="mt-4">There was an issue loading the lesson. Please try again later.</p>
      </main>
    );
  }

  return <LessonClient lesson={lesson} />;
}
