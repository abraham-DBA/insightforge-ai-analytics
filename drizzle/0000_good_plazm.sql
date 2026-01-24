CREATE TABLE "user" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizational_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"image" text,
	"created_at" text DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
