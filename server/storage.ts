import { binSurveyEntries, type BinSurveyEntry, type InsertBinSurveyEntry, users, type User, type InsertUser } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private binSurveyEntries: Map<number, BinSurveyEntry>;
  private currentUserId: number;
  private currentEntryId: number;

  constructor() {
    this.users = new Map();
    this.binSurveyEntries = new Map();
    this.currentUserId = 1;
    this.currentEntryId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllBinSurveyEntries(): Promise<BinSurveyEntry[]> {
    return Array.from(this.binSurveyEntries.values()).sort(
      (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );
  }

  async getBinSurveyEntry(id: number): Promise<BinSurveyEntry | undefined> {
    return this.binSurveyEntries.get(id);
  }

  async createBinSurveyEntry(insertEntry: InsertBinSurveyEntry): Promise<BinSurveyEntry> {
    const id = this.currentEntryId++;
    const entry: BinSurveyEntry = {
      ...insertEntry,
      id,
      datetime: new Date(),
      synced: false,
      photoUri: insertEntry.photoUri || null,
      comments: insertEntry.comments || null,
    };
    this.binSurveyEntries.set(id, entry);
    return entry;
  }

  async updateBinSurveyEntry(id: number, updateData: Partial<BinSurveyEntry>): Promise<BinSurveyEntry | undefined> {
    const entry = this.binSurveyEntries.get(id);
    if (!entry) return undefined;

    const updatedEntry = { ...entry, ...updateData };
    this.binSurveyEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteBinSurveyEntry(id: number): Promise<boolean> {
    return this.binSurveyEntries.delete(id);
  }

  async getUnsyncedEntries(): Promise<BinSurveyEntry[]> {
    return Array.from(this.binSurveyEntries.values()).filter(entry => !entry.synced);
  }

  async markAsSynced(id: number): Promise<boolean> {
    const entry = this.binSurveyEntries.get(id);
    if (!entry) return false;

    entry.synced = true;
    this.binSurveyEntries.set(id, entry);
    return true;
  }
}

export const storage = new MemStorage();
