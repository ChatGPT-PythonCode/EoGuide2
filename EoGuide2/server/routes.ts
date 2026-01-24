import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.guides.list.path, async (req, res) => {
    const params = {
      search: req.query.search as string | undefined,
      category: req.query.category as string | undefined,
    };
    const guides = await storage.getGuides(params);
    res.json(guides);
  });

  app.get(api.guides.getBySlug.path, async (req, res) => {
    const guide = await storage.getGuideBySlug(req.params.slug);
    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }
    res.json(guide);
  });

  app.get(api.guides.get.path, async (req, res) => {
    const guide = await storage.getGuide(Number(req.params.id));
    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }
    res.json(guide);
  });

  app.post(api.guides.create.path, async (req, res) => {
    try {
      const input = api.guides.create.input.parse(req.body);
      const guide = await storage.createGuide(input);
      res.status(201).json(guide);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed data function
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getGuides();
  if (existing.length === 0) {
    console.log("Seeding database with comprehensive guides...");
    
    // Quests
    await storage.createGuide({
      title: "Import Completed (Tutorial)",
      slug: "import-completed",
      category: "quest",
      summary: "The essential starting quest for all new players in Endless Online Recharged.",
      content: `
# Import Completed

**Location:** Factory Control room
**NPC:** Inventor → Import Assistant

## Walkthrough
1. Talk to the Inventor and select "What just happened?".
2. Talk to the Import Assistant.
3. Select "I take" to receive your starting equipment.

## Rewards
- Peasant Suit (male) / Peasant Clothes (female)
- 10x Tiny Health Potions
- 200 EXP
      `,
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    });

    await storage.createGuide({
      title: "Despair Maze Quest",
      slug: "despair-maze",
      category: "quest",
      summary: "Navigate the Woods of Despair to find Mindy's father.",
      content: `
# Despair Quest

**Location:** Port of Despair
**NPC:** Concerned Mindy

## Maze Solution
Follow these directions precisely in the Woods of Despair:
**NORTH → SOUTH → SOUTH → EAST → EAST → EAST → SOUTH → EAST → NORTH**

## Walkthrough
1. Talk to Concerned Mindy at the Port of Despair.
2. Navigate the maze using the solution above.
3. Find the Hermit Hut and speak to the Hermit.
4. Return to Mindy for your reward.

## Rewards
- 6,700 EXP
- 600 Eon
      `,
      imageUrl: "https://images.unsplash.com/photo-1508913922826-6f3c02bbf0ac?auto=format&fit=crop&q=80&w=800",
    });

    // Commands
    await storage.createGuide({
      title: "Essential In-Game Commands",
      slug: "essential-commands",
      category: "command",
      summary: "A list of useful chat commands to enhance your gameplay.",
      content: `
# Useful Commands

Type these directly into the chat prompt:

- **#boost** - Displays EXP boost available for levels 1-30.
- **#find [Player]** - Checks if a player is online and their location.
- **#item [Name]** - Displays stats, drop rates, and locations for an item.
- **#npc [Name]** - Displays HP, EXP, and drops for a monster.
- **#craft [Station]** - Shows what items can be crafted at a specific shop.
- **#ping** - Shows your connection latency to the server.
- **#location** - Displays your current map coordinates.
      `,
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    });

    // Travel
    await storage.createGuide({
      title: "Travel: Moonmurks Port",
      slug: "moonmurks-port-guide",
      category: "travel",
      summary: "How to unlock and navigate Moonmurks Port.",
      content: `
# Moonmurks Port Guide

Moonmurks Port is a key travel hub for players starting their journey.

## Access Requirements
Complete the **'Fully Briefed'** quest by talking to the Outpost Captain. You must collect 3 Supply Crates located across the western bridges.

## Key Locations
- **Boat to Aeven:** Located at the eastern dock.
- **Supply Platforms:** Found in the marshy areas to the west.
      `,
      imageUrl: "https://images.unsplash.com/photo-1506466010722-395ee2bef877?auto=format&fit=crop&q=80&w=800",
    });

    // Classes
    await storage.createGuide({
      title: "Class: The Mage",
      slug: "mage-guide",
      category: "class",
      summary: "Mastering magical arts and high burst damage.",
      content: `
# Mage Class Guide

Mages rely on Intelligence (INT) to deal massive damage from a distance.

## Stat Priority
1. **INT (Intelligence):** Increases spell damage and Max Mana.
2. **WIS (Wisdom):** Increases mana regeneration.

## Tips
- Keep a healthy supply of Mana Potions.
- Use 'Fireball' for single targets and 'Ice Blast' for slowing enemies.
      `,
      imageUrl: "https://images.unsplash.com/photo-1519074063912-ad2fe3f5193e?auto=format&fit=crop&q=80&w=800",
    });
  }
}
