import {
  pgTable,
  serial,
  text,
  integer,
  varchar
} from "drizzle-orm/pg-core";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", {
    length: 256
  }),
  email: varchar("email", {
    length: 256
  }).unique().notNull(),
  hashedPassword: text("hashed_password").notNull(),
  // Storing the current step_id for the user
  progress: integer("progress").default(1).notNull(),
  // Language preferences
  conversationLanguage: varchar("conversation_language", {
    length: 10
  }).default("en").notNull(), // User's native language (e.g., 'hi' for Hindi, 'es' for Spanish)
  targetLanguage: varchar("target_language", {
    length: 10
  }).default("en").notNull(), // Language they want to learn (e.g., 'en' for English)
  // Voice preference
  preferredVoiceId: varchar("preferred_voice_id", {
    length: 256
  }).default("21m00Tcm4TlvDq8ikWAM"), // ElevenLabs voice ID
});

// Lessons Table
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: varchar("title", {
    length: 256
  }).notNull(),
  description: text("description"),
  // Language configuration for lessons
  targetLanguage: varchar("target_language", {
    length: 10
  }).default("en").notNull(), // Language being taught
  instructionLanguage: varchar("instruction_language", {
    length: 10
  }).default("en").notNull(), // Language of instructions
});

// LessonSteps Table
export const lessonSteps = pgTable("lesson_steps", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .notNull()
    .references(() => lessons.id),
  agentPromptB: text("agent_prompt_b").notNull(),
  targetPhraseA: text("target_phrase_a").notNull(),
  expectedUserResponse: text("expected_user_response"),
  successFeedback: text("success_feedback").notNull(),
  failureFeedback: text("failure_feedback").notNull(),
  nextStepId: integer("next_step_id"),
});