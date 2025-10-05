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
  }).unique(),
  // A simple way to track progress, maybe storing the last completed step_id
  progress: integer("progress"),
});

// Lessons Table
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: varchar("title", {
    length: 256
  }).notNull(),
  description: text("description"),
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