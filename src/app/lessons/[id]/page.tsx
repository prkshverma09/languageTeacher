import { db } from '@/db';
import { lessons } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import LessonClient from '@/components/LessonClient';

type Lesson = {
  id: number;
  title: string;
  description: string | null;
  estimatedDuration: number | null;
  difficultyLevel: string | null;
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

    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      estimatedDuration: lesson.estimatedDuration,
      difficultyLevel: lesson.difficultyLevel,
    };
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
