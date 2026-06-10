import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const leads = pgTable("leads", {
  id: text().primaryKey(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
  name: text().notNull(),
  company: text().notNull().default("Not Specified"),
  email: text().notNull(),
  phone: text().notNull().default("Not Specified"),
  facilitySize: text("facility_size").notNull().default("Not Specified"),
  scorecardAnswers: jsonb("scorecard_answers").notNull().default({}),
  calculatedScore: integer("calculated_score").notNull().default(50),
  insights: jsonb().notNull().default({}),
});
