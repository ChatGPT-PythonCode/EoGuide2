import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GuideCard } from "@/components/GuideCard";
import { useGuides } from "@/hooks/use-guides";
import { EOR, type EorIndexRow, getIndexId, getIndexName } from "@/lib/eor";

export default function Npcs() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<EorIndexRow[] | null>(null);
  const [err, setErr] = useState<string>("");

  // Blog posts (curated guides) tagged as npc
  const { data: npcGuides, isLoading: isGuidesLoading } = useGuides("npc");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setErr("");
        // simple cache
        const cached = localStorage.getItem("eor_npcs_index_v1");
        if (cached) {
          const parsed = JSON.parse(cached) as EorIndexRow[];
          if (!cancelled) setRows(parsed);
          return;
        }

        const data = await EOR.listNpcs();
        localStorage.setItem("eor_npcs_index_v1", JSON.stringify(data));
        if (!cancelled) setRows(data);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Failed to load NPCs");
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const results = useMemo(() => {
    if (!rows) return [];
    const query = q.trim().toLowerCase();
    if (query.length < 2) return [];
    return rows
      .filter((r) => {
        const id = String(getIndexId(r));
        const name = getIndexName(r, "NPC").toLowerCase();
        return name.includes(query) || id.includes(query);
      })
      .slice(0, 24);
  }, [rows, q]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-secondary/20 border-b border-border/50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">NPCs</h1>
          <p className="text-muted-foreground">Search NPCs from the Exile EOR API and browse NPC guides.</p>

          <div className="mt-6 max-w-xl relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or id (type 2+ chars)…"
              className="pl-9"
            />
          </div>

          {err && (
            <div className="mt-4">
              <p className="text-red-400">{err}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 space-y-12">
        {/* API Results */}
        <section>
          <h2 className="text-2xl font-bold mb-4">NPC Lookup</h2>

          {!rows ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading NPC index…
            </div>
          ) : q.trim().length < 2 ? (
            <p className="text-muted-foreground">Start typing to see matches.</p>
          ) : results.length === 0 ? (
            <p className="text-muted-foreground">No matches.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {results.map((r) => {
                const id = getIndexId(r);
                const name = getIndexName(r, "NPC");
                return (
                  <Link key={id} href={`/npc/${id}`}>
                    <div className="group cursor-pointer bg-card/50 border border-border/50 rounded-xl p-3 hover:shadow-lg transition">
                      <div className="aspect-square rounded-lg overflow-hidden border border-border/50 bg-background/40">
                        <img
                          src={EOR.npcGraphicUrl(id)}
                          alt={name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="mt-2 font-medium text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {name}
                      </div>
                      <div className="text-xs text-muted-foreground">#{id}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Blog posts */}
        <section>
          <h2 className="text-2xl font-bold mb-4">NPC Guides</h2>

          {isGuidesLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : npcGuides && npcGuides.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {npcGuides.map((g) => (
                <GuideCard key={g.slug} guide={g} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-3xl border border-border/50 border-dashed">
              <p className="text-muted-foreground text-lg">No NPC guides yet. Add some from the admin panel.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
