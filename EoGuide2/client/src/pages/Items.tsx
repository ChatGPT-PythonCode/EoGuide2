import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EOR, type EorItemIndexRow } from "@/lib/eor";
import { useGuides } from "@/hooks/use-guides";
import { GuideCard } from "@/components/GuideCard";

function getId(r: EorItemIndexRow): number {
  return typeof r === "number" ? r : r.id;
}
function getName(r: EorItemIndexRow): string {
  return typeof r === "number" ? `Item #${r}` : (r.name || `Item #${r.id}`);
}

export default function Items() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<EorItemIndexRow[] | null>(null);
  const [err, setErr] = useState<string>("");

  const { data: itemGuides = [] } = useGuides("item");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setErr("");
        const cached = localStorage.getItem("eor_items_index_v1");
        if (cached) {
          const parsed = JSON.parse(cached) as EorItemIndexRow[];
          if (!cancelled) setRows(parsed);
          return;
        }

        const data = await EOR.listItems();
        localStorage.setItem("eor_items_index_v1", JSON.stringify(data));
        if (!cancelled) setRows(data);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Failed to load Items");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    if (!rows) return [];
    const query = q.trim().toLowerCase();
    if (query.length < 2) return [];
    return rows
      .filter((r) => {
        const id = String(getId(r));
        const name = getName(r).toLowerCase();
        return id.includes(query) || name.includes(query);
      })
      .slice(0, 24);
  }, [rows, q]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Items</h1>
          <p className="text-muted-foreground">Search items (Exile EOR API) + item guide posts</p>
        </div>

        <div className="w-full md:max-w-md relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search item name or id (min 2 chars)…"
            className="pl-9"
          />
        </div>
      </div>

      {err && (
        <div className="mb-6 text-red-400">
          {err}
        </div>
      )}

      {!rows ? (
        <div className="flex items-center gap-2 text-muted-foreground mb-10">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading item index…
        </div>
      ) : (
        <div className="mb-12">
          {q.trim().length < 2 ? (
            <p className="text-muted-foreground">Type at least 2 characters to search items.</p>
          ) : results.length === 0 ? (
            <p className="text-muted-foreground">No matches.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {results.map((r) => {
                const id = getId(r);
                const name = getName(r);
                return (
                  <Link key={id} href={`/items/${id}`}>
                    <div className="group cursor-pointer bg-card/50 border border-border/50 rounded-xl p-3 hover:shadow-lg transition">
                      <div className="aspect-square rounded-lg overflow-hidden border border-border/50 bg-background/40">
                        <img
                          src={EOR.itemGraphicUrl(id)}
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
        </div>
      )}

      <div className="border-t border-border/50 pt-10">
        <h2 className="text-2xl font-bold mb-4">Item Guides</h2>
        {itemGuides.length === 0 ? (
          <p className="text-muted-foreground">No item guide posts yet. Create one in /admin with category “item”.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {itemGuides.map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
