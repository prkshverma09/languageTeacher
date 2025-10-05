CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"email" varchar(256),
	"progress" integer,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text
);

CREATE TABLE IF NOT EXISTS "lesson_steps" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"agent_prompt_b" text NOT NULL,
	"target_phrase_a" text NOT NULL,
	"expected_user_response" text,
	"success_feedback" text NOT NULL,
	"failure_feedback" text NOT NULL,
	"next_step_id" integer
);

DO $$ BEGIN
 ALTER TABLE "lesson_steps" ADD CONSTRAINT "lesson_steps_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;