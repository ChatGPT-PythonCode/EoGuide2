import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

/**
 * GitHub Pages mode:
 * - Guides are stored in /content/guides/*.md
 * - Build step generates JSON to /client/public/data/guides/
 *   - index.json: guide summaries
 *   - <slug>.json: full guide content
 */

const GuideSummarySchema = z.object({
  title: z.string(),
  slug: z.string(),
  category: z.string(),
  summary: z.string(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  createdAt: z.string().optional(),
  folderPath: z.string().optional(),
  locationFolder: z.string().optional(),
});

export type GuideSummary = z.infer<typeof GuideSummarySchema>;

const GuideSchema = GuideSummarySchema.extend({
  content: z.string(),
});

export type GuideFull = z.infer<typeof GuideSchema>;

async function fetchGuideIndex(): Promise<GuideSummary[]> {
  const res = await fetch("data/guides/index.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("Failed to fetch guides index");
  const json = await res.json();
  return z.array(GuideSummarySchema).parse(json);
}

async function fetchGuide(slug: string): Promise<GuideFull | null> {
  const res = await fetch(`data/guides/${encodeURIComponent(slug)}.json`, { cache: "no-cache" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch guide");
  const json = await res.json();
  return GuideSchema.parse(json);
}

export function useGuides(category?: string, search?: string) {
  return useQuery({
    queryKey: ["guides-index"],
    queryFn: fetchGuideIndex,
    select: (all) => {
      let result = all;

      if (category) {
        result = result.filter((g) => g.category === category);
      }

      if (search) {
        const q = search.toLowerCase().trim();
        if (q) {
          result = result.filter((g) =>
            (g.title + " " + g.summary).toLowerCase().includes(q)
          );
        }
      }

      return result;
    },
  });
}

export function useGuideBySlug(slug: string) {
  return useQuery({
    queryKey: ["guide", slug],
    queryFn: () => fetchGuide(slug),
    enabled: Boolean(slug),
  });
}
