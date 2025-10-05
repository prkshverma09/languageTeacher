import { db } from '@/db';
import { lessons, lessonSteps } from '@/drizzle/schema';
import { lessons as mockLessons, lessonSteps as mockLessonSteps } from '@/lib/data';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('Seeding database...');

  try {
    // Clear existing data
    await db.delete(lessonSteps);
    await db.delete(lessons);
    console.log('Cleared existing data.');

    // Seed lessons
    await db.insert(lessons).values(mockLessons);
    console.log('Seeded lessons.');

    // Seed lesson steps
    await db.insert(lessonSteps).values(mockLessonSteps);
    console.log('Seeded lesson steps.');

    console.log('Database seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    // Drizzle with postgres.js doesn't require explicit connection closing for scripts.
    // The process will exit automatically.
  }
}

main();