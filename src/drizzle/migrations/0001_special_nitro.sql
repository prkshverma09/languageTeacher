CREATE TABLE "agents" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"agent_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"configuration" jsonb,
	CONSTRAINT "agents_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"agent_id" varchar(256) NOT NULL,
	"lesson_id" integer NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"duration" integer,
	"transcript" jsonb,
	"objectives_covered" jsonb,
	"metadata" jsonb
);
--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "knowledge_base_id" varchar(256);--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "learning_objectives" jsonb;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "teaching_guidance" text;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "example_conversations" jsonb;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "difficulty_level" varchar(50) DEFAULT 'beginner';--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "estimated_duration" integer DEFAULT 15;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "agent_id" varchar(256);--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;