import { useGuides } from "@/hooks/use-guides";
import { GuideCard } from "@/components/GuideCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: guides, isLoading } = useGuides();
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setLocation(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  // Get 3 random guides for "Featured" section
  const featuredGuides = guides ? [...guides].sort(() => 0.5 - Math.random()).slice(0, 3) : [];
  
  // Get 6 most recent guides
  const recentGuides = guides ? [...guides].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()).slice(0, 6) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="container relative mx-auto px-4 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Updated for Recharged</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white mb-6">
              Master the World of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Endless Online</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Your comprehensive compendium for quests, classes, items, and travel routes. 
              Explore the lands of Aeven with confidence.
            </p>

            <form onSubmit={handleSearch} className="max-w-md mx-auto relative mb-12">
              <input
                type="text"
                placeholder="Search for a quest, item, or guide..."
                className="w-full h-14 pl-14 pr-4 rounded-2xl bg-secondary/50 border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-secondary outline-none transition-all text-lg placeholder:text-muted-foreground/70"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Button type="submit" size="sm" className="absolute right-2 top-2 h-10 px-4 rounded-xl">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/quests">
                <Button size="lg" className="rounded-xl h-12 px-8 text-base">
                  Browse Quests
                </Button>
              </Link>
              <Link href="/classes">
                <Button size="lg" variant="outline" className="rounded-xl h-12 px-8 text-base bg-secondary/50 border-border/50 hover:bg-secondary hover:text-white">
                  Class Guides
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold">Featured Guides</h2>
          <Link href="/search">
            <Button variant="ghost" className="text-muted-foreground hover:text-white">
              View all <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-card animate-pulse border border-border/50" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {featuredGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        )}
      </section>

{/* Categories Grid */}
<section className="py-20 bg-secondary/20 border-y border-border/50">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold mb-4">Explore by Category</h2>
      <p className="text-muted-foreground">
        Find exactly what you're looking for
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      {[
        {
          label: "Quests",
          href: "/quests",
          bg: "from-amber-500/20 to-orange-600/20",
          border: "hover:border-amber-500/50",
        },
        {
          label: "Travel",
          href: "/travel",
          bg: "from-emerald-500/20 to-teal-600/20",
          border: "hover:border-emerald-500/50",
        },
        {
          label: "Classes",
          href: "/classes",
          bg: "from-violet-500/20 to-purple-600/20",
          border: "hover:border-violet-500/50",
        },
        {
          label: "NPCs",
          href: "/NPC",
          bg: "from-pink-500/20 to-rose-600/20",
          border: "hover:border-pink-500/50",
        },
        {
          label: "Items",
          href: "ITEMS",
          bg: "from-cyan-500/20 to-sky-600/20",
          border: "hover:border-cyan-500/50",
        },
        {
          label: "Updates",
          href: "UPDATES",
          bg: "from-lime-500/20 to-green-600/20",
          border: "hover:border-lime-500/50",
        },
        {
          label: "Official Announcements",
          href: "/ANNOUNCEMENTSs",
          bg: "from-orange-500/20 to-red-600/20",
          border: "hover:border-orange-500/50",
        },
        {
          label: "Commands",
          href: "/commands",
          bg: "from-blue-500/20 to-cyan-600/20",
          border: "hover:border-blue-500/50",
        },
      ].map((cat) => (
        <Link key={cat.href} href={cat.href}>
          <div
            className={`
              group relative aspect-square rounded-2xl p-6
              flex flex-col items-center justify-center text-center cursor-pointer
              bg-gradient-to-br ${cat.bg}
              border border-border/50 ${cat.border}
              transition-all duration-300
              hover:scale-[1.02] hover:shadow-xl
            `}
          >
            <h3 className="text-xl md:text-2xl font-bold text-white transition-transform group-hover:scale-110">
              {cat.label}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>


      {/* Latest Updates */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10">Latest Updates</h2>
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-card animate-pulse border border-border/50" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
