import { guides, type Guide, type InsertGuide } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or } from "drizzle-orm";

export interface IStorage {
  getGuides(params?: { search?: string; category?: string }): Promise<Guide[]>;
  getGuide(id: number): Promise<Guide | undefined>;
  getGuideBySlug(slug: string): Promise<Guide | undefined>;
  createGuide(guide: InsertGuide): Promise<Guide>;
}

export class DatabaseStorage implements IStorage {
  async getGuides(params?: { search?: string; category?: string }): Promise<Guide[]> {
    let query = db.select().from(guides);
    const filters = [];

    if (params?.search) {
      filters.push(ilike(guides.title, `%${params.search}%`));
    }

    if (params?.category) {
      filters.push(eq(guides.category, params.category));
    }

    if (filters.length > 0) {
      // @ts-ignore - drizzle type inference can be tricky with dynamic where
      return await query.where(or(...filters));
    }

    return await query;
  }

  async getGuide(id: number): Promise<Guide | undefined> {
    const [guide] = await db.select().from(guides).where(eq(guides.id, id));
    return guide;
  }

  async getGuideBySlug(slug: string): Promise<Guide | undefined> {
    const [guide] = await db.select().from(guides).where(eq(guides.slug, slug));
    return guide;
  }

  async createGuide(insertGuide: InsertGuide): Promise<Guide> {
    const [guide] = await db.insert(guides).values(insertGuide).returning();
    return guide;
  }
}

export const storage = new DatabaseStorage();
