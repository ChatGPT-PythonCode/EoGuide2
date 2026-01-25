import { useGuideBySlug } from "@/hooks/use-guides";
import { useRoute, Link } from "wouter";
import ReactMarkdown from "react-markdown";
import { Loader2, Calendar, ArrowLeft, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

function getVideoEmbedUrl(url?: string) {
  if (!url) return null;

  try {
    const u = new URL(url);

    // YouTube
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    // Vimeo
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    // ignore invalid URLs
  }

  return null;
}

/** ✅ Fix header/banners across GitHub Pages + custom domain */
function normalizeImageUrl(p?: string) {
  if (!p) return "";

  // If some posts were saved while on GitHub Pages, they may include this prefix.
  // On your custom domain, strip it.
  if (p.startsWith("/EoGuide2/uploads/")) return p.replace("/EoGuide2", "");

  // If Decap saved without a leading slash
  if (p.startsWith("uploads/")) return `/${p}`;

  return p;
}

export default function GuideDetail() {
  const [, params] = useRoute("/guides/:slug");
  const slug = params?.slug || "";
  const { data: guide, isLoading, error } = useGuideBySlug(slug);
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Guide Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The guide you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Guide URL has been copied to your clipboard.",
    });
  };

  const videoEmbedUrl = getVideoEmbedUrl(guide.videoUrl);
  const headerSrc = normalizeImageUrl(guide.imageUrl);

  

  const categoryRoutes: Record<string, string> = {
    quest: "quests",
    travel: "travel",
    class: "classes",
    command: "commands",
    npc: "npc",
    item: "item",
    updates: "updates",
    announcement: "announcements",
    misc: "misc",
  };

  const backRoute = categoryRoutes[guide.category] ?? "search";
return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Image/Gradient */}
      <div className="h-64 md:h-80 w-full relative overflow-hidden bg-secondary">
        {headerSrc ? (
          <img
            src={headerSrc}
            alt={guide.title}
            className="w-full h-full object-cover opacity-50"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-background to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

        <div className="absolute top-4 left-4 md:top-8 md:left-8 container mx-auto">
          <Link
            href={`/${backRoute}`}
          >
            <Button
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-black/20 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Title Card */}
          <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-2xl mb-8">
            <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground mb-4 font-medium">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 capitalize">
                {guide.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {guide.createdAt &&
                  format(new Date(guide.createdAt), "MMMM d, yyyy")}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
              {guide.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed border-l-4 border-primary pl-6 py-1 italic bg-background/50 rounded-r-lg">
              {guide.summary}
            </p>

            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" /> Share Guide
              </Button>
            </div>
          </div>

          {/* Video */}
          {videoEmbedUrl && (
            <div className="bg-card/50 rounded-2xl p-4 md:p-6 border border-border/50 mb-8">
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-border/50">
                <iframe
                  src={videoEmbedUrl}
                  title={guide.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Markdown Content */}
          <div className="bg-card/50 rounded-2xl p-8 md:p-12 border border-border/50">
            <article className="prose prose-lg prose-invert max-w-none">
              <ReactMarkdown>{guide.content}</ReactMarkdown>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
