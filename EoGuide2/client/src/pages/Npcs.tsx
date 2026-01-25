import { useGuides } from "@/hooks/use-guides";
import { GuideCard } from "@/components/GuideCard";

export default function Npcs() {
  const { data: npcGuides = [], isLoading, error } = useGuides("npc");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">NPC Guides</h1>
        <p className="text-muted-foreground">
          Community & official NPC posts
        </p>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="text-red-400">Failed to load NPC guides.</p>
      ) : npcGuides.length === 0 ? (
        <p className="text-muted-foreground">
          No NPC guide posts yet. Create one in <code>/admin</code> with category{" "}
          <code>npc</code>.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {npcGuides.map((g) => (
            <GuideCard key={g.slug} guide={g} />
          ))}
        </div>
      )}
    </div>
  );
}
