import { binSurveyEntries, type BinSurveyEntry, type InsertBinSurveyEntry, users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Bin Survey Entries
  getAllBinSurveyEntries(): Promise<BinSurveyEntry[]>;
  getBinSurveyEntry(id: number): Promise<BinSurveyEntry | undefined>;
  createBinSurveyEntry(entry: InsertBinSurveyEntry): Promise<BinSurveyEntry>;
  updateBinSurveyEntry(id: number, entry: Partial<BinSurveyEntry>): Promise<BinSurveyEntry | undefined>;
  deleteBinSurveyEntry(id: number): Promise<boolean>;
  getUnsyncedEntries(): Promise<BinSurveyEntry[]>;
  markAsSynced(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllBinSurveyEntries(): Promise<BinSurveyEntry[]> {
    const entries = await db
      .select()
      .from(binSurveyEntries)
      .orderBy(desc(binSurveyEntries.datetime));
    return entries;
  }

  async getBinSurveyEntry(id: number): Promise<BinSurveyEntry | undefined> {
    const [entry] = await db
      .select()
      .from(binSurveyEntries)
      .where(eq(binSurveyEntries.id, id));
    return entry || undefined;
  }

  async createBinSurveyEntry(insertEntry: InsertBinSurveyEntry): Promise<BinSurveyEntry> {
    const [entry] = await db
      .insert(binSurveyEntries)
      .values(insertEntry)
      .returning();
    return entry;
  }

  async updateBinSurveyEntry(id: number, updateData: Partial<BinSurveyEntry>): Promise<BinSurveyEntry | undefined> {
    const [entry] = await db
      .update(binSurveyEntries)
      .set(updateData)
      .where(eq(binSurveyEntries.id, id))
      .returning();
    return entry || undefined;
  }

  async deleteBinSurveyEntry(id: number): Promise<boolean> {
    const result = await db
      .delete(binSurveyEntries)
      .where(eq(binSurveyEntries.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getUnsyncedEntries(): Promise<BinSurveyEntry[]> {
    const entries = await db
      .select()
      .from(binSurveyEntries)
      .where(eq(binSurveyEntries.synced, false))
      .orderBy(desc(binSurveyEntries.datetime));
    return entries;
  }

  async markAsSynced(id: number): Promise<boolean> {
    const result = await db
      .update(binSurveyEntries)
      .set({ synced: true })
      .where(eq(binSurveyEntries.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
