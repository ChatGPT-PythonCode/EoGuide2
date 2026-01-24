import { Link } from "wouter";
import { type GuideSummary } from "@/hooks/use-guides";
import { Map, Scroll, Swords, Terminal } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const categoryIcons = {
  quest: Scroll,
  travel: Map,
  class: Swords,
  command: Terminal,
  misc: Terminal,
} as const;

const categoryColors = {
  quest: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  travel: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  class: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  command: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  misc: "text-slate-400 bg-slate-400/10 border-slate-400/20",
} as const;

export function GuideCard({ guide }: { guide: GuideSummary }) {
  const Icon =
    categoryIcons[guide.category as keyof typeof categoryIcons] || Terminal;
  const colorClass =
    categoryColors[guide.category as keyof typeof categoryColors] ||
    categoryColors.misc;

  return (
    <Link href={`/guides/${guide.slug}`} className="block group h-full">
      <article
        className="
        h-full bg-card rounded-2xl p-6 border border-border/50
        shadow-lg shadow-black/20
        hover:shadow-xl hover:border-primary/50 hover:-translate-y-1
        transition-all duration-300 flex flex-col
      "
      >
        <div className="flex items-start justify-between mb-4">
          <div className={cn("p-2 rounded-lg border", colorClass)}>
            <Icon className="w-5 h-5" />
          </div>
          {guide.createdAt && (
            <span className="text-xs text-muted-foreground font-mono">
              {format(new Date(guide.createdAt), "MMM d, yyyy")}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {guide.title}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
          {guide.summary}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <span className={cn("text-xs font-medium px-2 py-1 rounded-full border capitalize", colorClass)}>
            {guide.category}
          </span>
          <span className="text-sm text-primary font-medium group-hover:translate-x-1 transition-transform">
            Read →
          </span>
        </div>
      </article>
    </Link>
  );
}
