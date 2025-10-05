import { db } from '@/db';
import { users, lessons, lessonSteps } from '@/drizzle/schema';
import { lessons as mockLessons, lessonSteps as mockLessonSteps } from '@/lib/data';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';

dotenv.config();

async function main() {
  console.log('Seeding database...');

  try {
    // Clear existing data
    await db.delete(lessonSteps);
    await db.delete(lessons);
    await db.delete(users);
    console.log('Cleared existing data.');

    // Seed test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    await db.insert(users).values({
        name: 'Test User',
        email: 'test@example.com',
        hashedPassword: hashedPassword,
        progress: 1, // Start at the first step
    });
    console.log('Seeded test user (test@example.com / password123)');

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
  }
}

main();