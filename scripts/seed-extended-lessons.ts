/**
 * Script to seed extended lesson data into the database
 * Run with: npx tsx scripts/seed-extended-lessons.ts
 */

import { db } from "../src/db";
import { lessons } from "../src/drizzle/schema";
import { eq } from "drizzle-orm";
import { extendedLessons } from "../src/lib/extended-lesson-data";

async function seedExtendedLessons() {
  try {
    console.log("Starting to seed extended lesson data...\n");

    for (const lesson of extendedLessons) {
      console.log(`Processing Lesson ${lesson.id}: ${lesson.title}`);

      // Check if lesson exists
      const existing = await db
        .select()
        .from(lessons)
        .where(eq(lessons.id, lesson.id))
        .limit(1);

      if (existing.length > 0) {
        // Update existing lesson
        console.log(`  Updating existing lesson...`);
        await db
          .update(lessons)
          .set({
            title: lesson.title,
            description: lesson.description,
            targetLanguage: lesson.targetLanguage,
            learningObjectives: lesson.learningObjectives,
            teachingGuidance: lesson.teachingGuidance,
            exampleConversations: lesson.exampleConversations,
            difficultyLevel: lesson.difficultyLevel,
            estimatedDuration: lesson.estimatedDuration,
          })
          .where(eq(lessons.id, lesson.id));

        console.log(`  ✅ Updated lesson ${lesson.id}\n`);
      } else {
        // Insert new lesson
        console.log(`  Creating new lesson...`);
        await db.insert(lessons).values({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          targetLanguage: lesson.targetLanguage,
          instructionLanguage: "en", // Default
          learningObjectives: lesson.learningObjectives,
          teachingGuidance: lesson.teachingGuidance,
          exampleConversations: lesson.exampleConversations,
          difficultyLevel: lesson.difficultyLevel,
          estimatedDuration: lesson.estimatedDuration,
        });

        console.log(`  ✅ Created lesson ${lesson.id}\n`);
      }
    }

    console.log("\n✅ All lessons seeded successfully!");
    console.log(`\nTotal lessons: ${extendedLessons.length}`);
    console.log("\nLesson Summary:");
    extendedLessons.forEach((lesson) => {
      console.log(
        `  - Lesson ${lesson.id}: ${lesson.title} (${lesson.learningObjectives.length} phrases, ${lesson.estimatedDuration} min)`
      );
    });
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    throw error;
  }
}

// Run seeding
seedExtendedLessons()
  .then(() => {
    console.log("\nExiting...");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
