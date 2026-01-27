import { useGuides } from "@/hooks/use-guides";
import { GuideCard } from "@/components/GuideCard";
import { useLocation } from "wouter";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function SearchResults() {
  const [location, setLocation] = useLocation();

  // When using hash-based routing (GitHub Pages), query params live inside the hash.
  // Example: https://site/#/search?q=ant
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const initialQuery = searchParams.get("q") || "";
  const [search, setSearch] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);

  const { data: guides, isLoading } = useGuides(undefined, query);

  useEffect(() => {
    setSearch(initialQuery);
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setQuery(search);
      setLocation(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Search Results</h1>

        <form onSubmit={handleSearch} className="max-w-xl mb-12 relative">
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 pl-12 text-lg bg-secondary/50 border-border/50"
            placeholder="Search guides..."
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Button type="submit" className="absolute right-1 top-1 h-10">Search</Button>
        </form>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : guides && guides.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-2xl border border-border/50 border-dashed">
            <div className="inline-flex p-4 rounded-full bg-secondary mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-muted-foreground">Try searching for something else like "Green Slime" or "Warp".</p>
          </div>
        )}
      </div>
    </div>
  );
}
