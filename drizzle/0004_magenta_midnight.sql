CREATE TABLE "sections" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_email" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"tone" text NOT NULL,
	"allowed_topics" text,
	"blocked_topics" text,
	"source_ids" text[] NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" text DEFAULT now()
);
