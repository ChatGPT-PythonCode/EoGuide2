import { useGuides } from "@/hooks/use-guides";
import { GuideCard } from "@/components/GuideCard";
import { useRoute } from "wouter";
import { Loader2, Scroll, Map, Swords, Terminal } from "lucide-react";

const categories = {
  quests: { title: "Quest Guides", description: "Walkthroughs for every quest in EO", icon: Scroll, color: "text-amber-400" },
  travel: { title: "Travel Routes", description: "Maps and directions to key locations", icon: Map, color: "text-emerald-400" },
  classes: { title: "Class Builds", description: "Stats and skill builds for every class", icon: Swords, color: "text-violet-400" },
  commands: { title: "Commands", description: "List of all in-game commands", icon: Terminal, color: "text-blue-400" },
} as const;

export default function CategoryPage() {
  const [match, params] = useRoute("/:category");
  const categoryKey = params?.category as keyof typeof categories;
  const config = categories[categoryKey];

  // Map route param to DB category value
  const dbCategory = categoryKey === 'quests' ? 'quest' 
    : categoryKey === 'travel' ? 'travel' 
    : categoryKey === 'classes' ? 'class'
    : categoryKey === 'commands' ? 'command'
    : undefined;

  const { data: guides, isLoading } = useGuides(dbCategory);

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border border-border/50 border-dashed">
            <p className="text-muted-foreground text-lg">No guides found in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
