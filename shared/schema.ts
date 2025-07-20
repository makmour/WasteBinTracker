import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const binSurveyEntries = pgTable("bin_survey_entries", {
  id: serial("id").primaryKey(),
  datetime: timestamp("datetime").notNull().defaultNow(),
  street: text("street").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  binTypes: text("bin_types").array().notNull(),
  quantity: integer("quantity").notNull(),
  photoUri: text("photo_uri"),
  comments: text("comments"),
  synced: boolean("synced").notNull().default(false),
});

export const insertBinSurveyEntrySchema = createInsertSchema(binSurveyEntries).omit({
  id: true,
  datetime: true,
  synced: true,
});

export type InsertBinSurveyEntry = z.infer<typeof insertBinSurveyEntrySchema>;
export type BinSurveyEntry = typeof binSurveyEntries.$inferSelect;

// Predefined streets for Glyfada Municipality
export const GLYFADA_STREETS = [
  "Markou Mpotsari",
  "Leoforos Vouliagmenis",
  "Konstantinou Karamanli",
  "Areos",
  "Dimokratias",
  "Metaxa",
  "Gounari",
  "Lazaraki",
  "Angelou Sikelianou",
  "Dousmani"
] as const;

export const BIN_TYPES = ["Green", "Blue", "Brown", "Yellow"] as const;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
