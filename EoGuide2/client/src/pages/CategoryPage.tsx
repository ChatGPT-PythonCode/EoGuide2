import { useGuides } from "@/hooks/use-guides";
import { GuideCard } from "@/components/GuideCard";
import { useRoute, useLocation } from "wouter";
import { Loader2, Scroll, Map, Swords, Terminal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = {
  quests: { title: "Quest Guides", description: "Walkthroughs for every quest in EO", icon: Scroll, color: "text-amber-400" },
  travel: { title: "Travel Routes", description: "Maps and directions to key locations", icon: Map, color: "text-emerald-400" },
  classes: { title: "Class Builds", description: "Stats and skill builds for every class", icon: Swords, color: "text-violet-400" },
  commands: { title: "Commands", description: "List of all in-game commands", icon: Terminal, color: "text-blue-400" },
} as const;

export default function CategoryPage() {
  const [match, params] = useRoute("/:category");
  const [location, setLocation] = useLocation();
  const categoryKey = params?.category as keyof typeof categories;
  const config = categories[categoryKey];

  // Map route param to DB category value
  const dbCategory = categoryKey === 'quests' ? 'quest' 
    : categoryKey === 'travel' ? 'travel' 
    : categoryKey === 'classes' ? 'class'
    : categoryKey === 'commands' ? 'command'
    : undefined;

  const { data: guides, isLoading } = useGuides(dbCategory);

  // --- Quest location helpers (no DB changes needed) ---
  const extractQuestLocation = (content?: string) => {
    if (!content) return "Unknown";
    // Common formats seen in quest markdown imports:
    // **Location:** Hallodale
    // Location: Hallodale North
    const m1 = content.match(/\*\*\s*Location\s*:\s*\*\*\s*([^\n\r]+)/i);
    if (m1?.[1]) return m1[1].trim();
    const m2 = content.match(/^\s*Location\s*:\s*([^\n\r]+)/im);
    if (m2?.[1]) return m2[1].trim();
    return "Unknown";
  };

  const questLocations = useMemo(() => {
    if (dbCategory !== "quest" || !guides) return [] as string[];
    const set = new Set<string>();
    for (const g of guides) set.add(extractQuestLocation(g.content));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [dbCategory, guides]);

  const urlLoc = useMemo(() => {
    const sp = new URLSearchParams(location.split("?")[1] || "");
    return sp.get("loc") || "all";
  }, [location]);

  const [selectedLoc, setSelectedLoc] = useState<string>(urlLoc);
  useEffect(() => {
    setSelectedLoc(urlLoc);
  }, [urlLoc]);

  const filteredGuides = useMemo(() => {
    if (!guides) return [];
    if (dbCategory !== "quest") return guides;
    if (selectedLoc === "all") return guides;
    return guides.filter((g) => extractQuestLocation(g.content) === selectedLoc);
  }, [dbCategory, guides, selectedLoc]);

  const groupedByLocation = useMemo(() => {
    if (dbCategory !== "quest") return null;
    const map = new Map<string, typeof filteredGuides>();
    for (const g of filteredGuides) {
      const loc = extractQuestLocation(g.content);
      const arr = map.get(loc) || [];
      arr.push(g);
      map.set(loc, arr);
    }
    // Sort groups + within each group by title
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([loc, gs]) => [loc, [...gs].sort((a, b) => a.title.localeCompare(b.title))] as const);
  }, [dbCategory, filteredGuides]);

  if (!match || !config) return null; // Or redirect/404

  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-secondary/20 border-b border-border/50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl bg-card border border-border ${config.color}`}>
              <Icon className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">{config.title}</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl">{config.description}</p>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : guides && guides.length > 0 ? (
          <>
            {/* Quest location filter */}
            {dbCategory === "quest" && questLocations.length > 0 && (
              <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Filter by location</h2>
                  <p className="text-sm text-muted-foreground">Quests are grouped by location. Pick one to narrow the list.</p>
                </div>
                <Select
                  value={selectedLoc}
                  onValueChange={(v) => {
                    setSelectedLoc(v);
                    const base = `/${categoryKey}`;
                    const next = v === "all" ? base : `${base}?loc=${encodeURIComponent(v)}`;
                    setLocation(next);
                  }}
                >
                  <SelectTrigger className="w-full md:w-80 bg-secondary/50 border-border/50">
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    {questLocations.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quests: grouped by location. Other categories: normal grid. */}
            {dbCategory === "quest" && groupedByLocation ? (
              <div className="space-y-12">
                {groupedByLocation.map(([loc, gs]) => (
                  <section key={loc}>
                    <div className="flex items-baseline justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white">{loc}</h3>
                      <span className="text-sm text-muted-foreground">{gs.length} quest{gs.length === 1 ? "" : "s"}</span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {gs.map((guide) => (
                        <GuideCard key={guide.id} guide={guide} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border border-border/50 border-dashed">
            <p className="text-muted-foreground text-lg">No guides found in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
