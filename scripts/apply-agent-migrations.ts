/**
 * Script to manually apply agent-related database migrations
 * Run with: npm run tsx scripts/apply-agent-migrations.ts
 */

import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function applyMigrations() {
  try {
    console.log("Starting migration...");

    // Create agents table
    console.log("Creating agents table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS agents (
        id serial PRIMARY KEY NOT NULL,
        user_id integer NOT NULL,
        agent_id varchar(256) NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL,
        configuration jsonb,
        CONSTRAINT agents_user_id_unique UNIQUE(user_id)
      )
    `);

    // Add foreign key for agents
    console.log("Adding agents foreign key...");
    try {
      await db.execute(sql`
        ALTER TABLE agents
        ADD CONSTRAINT agents_user_id_users_id_fk
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
    } catch (error) {
      console.log("Foreign key might already exist, skipping...");
    }

    // Create conversations table
    console.log("Creating conversations table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id serial PRIMARY KEY NOT NULL,
        user_id integer NOT NULL,
        agent_id varchar(256) NOT NULL,
        lesson_id integer NOT NULL,
        started_at timestamp DEFAULT now() NOT NULL,
        completed_at timestamp,
        duration integer,
        transcript jsonb,
        objectives_covered jsonb,
        metadata jsonb
      )
    `);

    // Add foreign keys for conversations
    console.log("Adding conversations foreign keys...");
    try {
      await db.execute(sql`
        ALTER TABLE conversations
        ADD CONSTRAINT conversations_user_id_users_id_fk
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
    } catch (error) {
      console.log("User foreign key might already exist, skipping...");
    }

    try {
      await db.execute(sql`
        ALTER TABLE conversations
        ADD CONSTRAINT conversations_lesson_id_lessons_id_fk
        FOREIGN KEY (lesson_id) REFERENCES lessons(id)
        ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
    } catch (error) {
      console.log("Lesson foreign key might already exist, skipping...");
    }

    // Add new columns to lessons table
    console.log("Adding new columns to lessons table...");
    const lessonsColumns = [
      "ALTER TABLE lessons ADD COLUMN IF NOT EXISTS knowledge_base_id varchar(256)",
      "ALTER TABLE lessons ADD COLUMN IF NOT EXISTS learning_objectives jsonb",
      "ALTER TABLE lessons ADD COLUMN IF NOT EXISTS teaching_guidance text",
      "ALTER TABLE lessons ADD COLUMN IF NOT EXISTS example_conversations jsonb",
      "ALTER TABLE lessons ADD COLUMN IF NOT EXISTS difficulty_level varchar(50) DEFAULT 'beginner'",
      "ALTER TABLE lessons ADD COLUMN IF NOT EXISTS estimated_duration integer DEFAULT 15",
    ];

    for (const query of lessonsColumns) {
      try {
        await db.execute(sql.raw(query));
      } catch (error) {
        console.log(`Column might already exist, skipping...`);
      }
    }

    // Add new column to users table
    console.log("Adding agent_id column to users table...");
    try {
      await db.execute(sql`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS agent_id varchar(256)
      `);
    } catch (error) {
      console.log("Column might already exist, skipping...");
    }

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migrations
applyMigrations()
  .then(() => {
    console.log("Exiting...");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
