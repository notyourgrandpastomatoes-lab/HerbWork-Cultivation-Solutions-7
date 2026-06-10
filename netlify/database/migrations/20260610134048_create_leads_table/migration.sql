CREATE TABLE IF NOT EXISTS "leads" (
	"id" text PRIMARY KEY,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"company" text DEFAULT 'Not Specified' NOT NULL,
	"email" text NOT NULL,
	"phone" text DEFAULT 'Not Specified' NOT NULL,
	"facility_size" text DEFAULT 'Not Specified' NOT NULL,
	"scorecard_answers" jsonb DEFAULT '{}' NOT NULL,
	"calculated_score" integer DEFAULT 50 NOT NULL,
	"insights" jsonb DEFAULT '{}' NOT NULL
);
