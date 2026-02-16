CREATE TABLE "chatBotMetaData" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_email" text NOT NULL,
	"color" text DEFAULT '#4f39f6',
	"welcome_message" text DEFAULT 'Hi! I''m your AI assistant. Which area would you like to explore today?',
	"created_at" text DEFAULT now()
);
