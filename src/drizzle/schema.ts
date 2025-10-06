import {
  pgTable,
  serial,
  text,
  integer,
  varchar,
  timestamp,
  jsonb
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
  // ElevenLabs Agent ID
  agentId: varchar("agent_id", {
    length: 256
  }), // ElevenLabs conversational agent ID
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
  // Knowledge base and agent configuration
  knowledgeBaseId: varchar("knowledge_base_id", {
    length: 256
  }), // ElevenLabs knowledge base ID
  learningObjectives: jsonb("learning_objectives"), // Array of phrases to teach
  teachingGuidance: text("teaching_guidance"), // Instructions for the agent
  exampleConversations: jsonb("example_conversations"), // Sample dialogues
  difficultyLevel: varchar("difficulty_level", {
    length: 50
  }).default("beginner"), // beginner, intermediate, advanced
  estimatedDuration: integer("estimated_duration").default(15), // Duration in minutes
});

// LessonSteps Table (DEPRECATED - will be removed after migration to agent-based system)
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

// Agents Table (tracks ElevenLabs agent configurations)
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => users.id),
  agentId: varchar("agent_id", {
    length: 256
  }).notNull(), // ElevenLabs agent ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  configuration: jsonb("configuration"), // Store agent configuration details
});

// Conversations Table (tracks conversation sessions)
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  agentId: varchar("agent_id", {
    length: 256
  }).notNull(),
  lessonId: integer("lesson_id")
    .notNull()
    .references(() => lessons.id),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  duration: integer("duration"), // Duration in seconds
  transcript: jsonb("transcript"), // Full conversation transcript
  objectivesCovered: jsonb("objectives_covered"), // Array of objectives covered
  metadata: jsonb("metadata"), // Additional metadata (interruptions, questions, etc.)
});
