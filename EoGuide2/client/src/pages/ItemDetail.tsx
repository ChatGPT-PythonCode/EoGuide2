  import { useEffect, useState } from "react";
  import { Link, useRoute } from "wouter";
  import { ArrowLeft, Loader2 } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { EOR, type EorItem } from "@/lib/eor";

  export default function ItemDetail() {
    const [, params] = useRoute("/item/:id");
    const id = Number(params?.id || 0);

    const [item, setItem] = useState<EorItem | null>(null);
    const [err, setErr] = useState<string>("");

    useEffect(() => {
      let cancelled = false;
      async function load() {
        try {
          setErr("");
          setItem(null);
          if (!id) return;
          const data = await EOR.getItem(id);
          if (!cancelled) setItem(data);
        } catch (e: any) {
          if (!cancelled) setErr(e?.message || "Failed to load Item");
        }
      }
      load();
      return () => { cancelled = true; };
    }, [id]);

    if (err) {
      return (
        <div className="container mx-auto px-4 py-12">
          <p className="text-red-400 mb-4">{err}</p>
          <Link href="/item"><Button>Back to Items</Button></Link>
        </div>
      );
    }

    if (!item) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 py-10">
          <Link href="/item">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Items
            </Button>
          </Link>

          <div className="bg-card/50 rounded-2xl border border-border/50 p-6">
            <div className="flex gap-6 flex-col md:flex-row">
              <div className="w-40 h-40 rounded-xl overflow-hidden border border-border/50 bg-background/40">
                <img src={EOR.itemGraphicUrl(item.id)} alt={item.name} className="w-full h-full object-contain" />
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold">{item.name}</h1>
                <p className="text-muted-foreground">Item #{item.id}</p>

                <div className="mt-6">
                  <h2 className="font-semibold mb-2">Data</h2>
                  <pre className="text-xs bg-background/50 p-4 rounded-xl overflow-auto border border-border/50">
{JSON.stringify(item, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
