import { db } from '../src/db';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config();

async function addLanguageFields() {
  console.log('Adding language fields to database...');

  try {
    // Add language fields to users table
    await db.execute(sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS conversation_language VARCHAR(10) DEFAULT 'en' NOT NULL,
      ADD COLUMN IF NOT EXISTS target_language VARCHAR(10) DEFAULT 'en' NOT NULL,
      ADD COLUMN IF NOT EXISTS preferred_voice_id VARCHAR(256) DEFAULT '21m00Tcm4TlvDq8ikWAM'
    `);
    console.log('✓ Added language fields to users table');

    // Add language fields to lessons table
    await db.execute(sql`
      ALTER TABLE lessons
      ADD COLUMN IF NOT EXISTS target_language VARCHAR(10) DEFAULT 'en' NOT NULL,
      ADD COLUMN IF NOT EXISTS instruction_language VARCHAR(10) DEFAULT 'en' NOT NULL
    `);
    console.log('✓ Added language fields to lessons table');

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

addLanguageFields();
